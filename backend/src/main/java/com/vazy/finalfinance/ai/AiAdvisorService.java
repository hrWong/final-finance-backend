package com.vazy.finalfinance.ai;

import com.vazy.finalfinance.dashboard.service.DashboardService;
import com.vazy.finalfinance.dashboard.vo.DashboardSummaryResponse;
import com.vazy.finalfinance.position.service.PositionService;
import com.vazy.finalfinance.position.vo.PositionResponse;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.StreamingResponseHandler;
import dev.langchain4j.model.output.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiAdvisorService {

    private final StreamingChatLanguageModel streamingChatLanguageModel;
    private final DashboardService dashboardService;
    private final PositionService positionService;

    public SseEmitter streamChat(String userPrompt) {
        SseEmitter emitter = new SseEmitter(60000L); // 1 minute timeout

        // 1. Fetch real-time context
        DashboardSummaryResponse summary = dashboardService.getSummary();
        List<PositionResponse> positions = positionService.getPositions();

        // 2. Build System Prompt with context
        String context = buildContextPrompt(summary, positions);
        
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new SystemMessage(
            "你是一位金融投资顾问。由于显示空间有限，你必须遵循以下极简沟通规范：\n\n" +
            "1. **严禁使用 Markdown 格式**：不要使用任何星号（**）、井号（#）或其他 MD 符号。\n" +
            "2. **强制精简**：每一条建议不要超过两行。只说核心结论和操作（增持/减持/持有）。\n" +
            "3. **分点分行**：不同的观点使用数字序号（1. 2. 3.）并强制换行，确保一眼扫视即可获取核心信息。\n" +
            "4. **纯文本风格**：核心标的和数值直接以纯文本展示，例如：[NVDA] 当前盈亏 +5%。\n\n" +
            "当用户询问持仓分析时，请参考以下背景：\n" +
            context + "\n\n" +
            "风格偏好：专业、冷静、极简。不要口舌，直接给结论。"
        ));
        messages.add(new UserMessage(userPrompt));

        // 3. Start Streaming
        streamingChatLanguageModel.generate(messages, new StreamingResponseHandler<AiMessage>() {
            @Override
            public void onNext(String token) {
                try {
                    emitter.send(SseEmitter.event().data(token));
                } catch (IOException e) {
                    log.warn("Failed to send token to client", e);
                }
            }

            @Override
            public void onComplete(Response<AiMessage> response) {
                emitter.complete();
            }

            @Override
            public void onError(Throwable error) {
                log.error("AI Streaming error", error);
                emitter.completeWithError(error);
            }
        });

        return emitter;
    }

    private String buildContextPrompt(DashboardSummaryResponse summary, List<PositionResponse> positions) {
        StringBuilder sb = new StringBuilder();
        sb.append("--- 持仓快照 ---\n");
        sb.append(String.format("总市值: %s %s\n", summary.totalValue(), summary.baseCurrency()));
        sb.append(String.format("可用余额 (现金): %s %s\n", summary.cash(), summary.baseCurrency()));
        sb.append(String.format("当前累计盈亏: %s (%s%%)\n", summary.totalPnl(), summary.totalPnlPct()));
        
        sb.append("\n持仓明细:\n");
        for (PositionResponse p : positions) {
            sb.append(String.format("- %s (%s): 数量 %s, 市值 %s, 盈亏 %s (%s%%), 仓位占比 %s%%\n",
                p.assetName(), p.symbol(), p.quantity(), p.marketValue(), 
                p.unrealizedPnl(), p.unrealizedPnlPct(), p.portfolioWeight()));
        }
        sb.append("---------------");
        return sb.toString();
    }
}
