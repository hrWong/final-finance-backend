package com.vazy.finalfinance.ai;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.dashboard.vo.AllocationItemResponse;
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
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiAdvisorService {

    private final StreamingChatLanguageModel streamingChatLanguageModel;
    private final DashboardService dashboardService;
    private final PositionService positionService;
    private final AssetMapper assetMapper;

    public SseEmitter streamChat(String userPrompt) {
        SseEmitter emitter = new SseEmitter(60000L); // 1 minute timeout

        // 1. Fetch portfolio snapshot context
        DashboardSummaryResponse summary = dashboardService.getSummary();
        List<PositionResponse> positions = positionService.getPositions();
        List<AllocationItemResponse> allocations = dashboardService.getAllocation();

        // 2. Build System Prompt with context
        String context = buildContextPrompt(summary, positions, allocations);
        
        List<ChatMessage> messages = new ArrayList<>();
        messages.add(new SystemMessage(buildSystemPrompt(context)));
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

    private String buildSystemPrompt(String context) {
        return """
                你是本项目内置的投资组合分析助手，不是泛泛而谈的聊天机器人。
                你只能依据系统提供的投资组合快照和用户问题作答，不能编造新闻、财报、实时价格、行业事件或未来确定性收益。

                数据口径说明：
                1. 当前上下文是投资组合快照，不保证是实时盘口。
                2. totalValue 仅代表持仓市值，不包含现金余额。
                3. lastPrice 是系统当前用于估值的价格；本项目很多场景按昨日收盘价口径估值。
                4. priceAsOf 是该估值价格对应的时间；如果为空，表示系统没有提供估值时间。
                5. 若某项数据未提供，直接说明“当前数据未提供”，不要猜测。
                6. 所有数字必须逐字使用系统快照中的原始值，不要自行补零、加千分位、拼接额外数字或重新计算。
                7. 如果系统快照里是 1133.79，你就必须输出 1133.79，不能改成 1,133.79，更不能改成 1,000,133.79。

                输出要求：
                1. 只输出纯文本，不要使用 Markdown、星号、井号、表格或代码块。
                2. 优先使用 1. 2. 3. 这样的编号，每一点不超过两句话。
                3. 先给结论，再给依据，再给建议。
                4. 提到具体持仓时，使用“名称(Symbol)”格式。
                5. 如果用户要求建议，请基于仓位集中度、盈亏、现金比例和持仓表现给出增持/减持/持有建议。
                6. 明确提醒你的判断基于当前组合快照，而不是实时行情。
                7. 如果用户问“我的持仓是多少”或类似问题，优先回答持仓数量和持仓列表；如果当前没有持仓，就直接说“当前没有持仓”。
                8. 在用户没有明确询问现金时，不要重复展开现金占比、资产配置百分比等次要信息。

                当前投资组合快照如下：
                """ + "\n" + context;
    }

    private String buildContextPrompt(
            DashboardSummaryResponse summary,
            List<PositionResponse> positions,
            List<AllocationItemResponse> allocations
    ) {
        StringBuilder sb = new StringBuilder();
        sb.append("SNAPSHOT_FACTS\n");
        sb.append(String.format("baseCurrency=%s\n", safe(summary.baseCurrency())));
        sb.append(String.format("summary.totalValue=%s\n", decimal(summary.totalValue())));
        sb.append(String.format("summary.cash=%s\n", decimal(summary.cash())));
        sb.append(String.format("summary.investedAmount=%s\n", decimal(summary.investedAmount())));
        sb.append(String.format("summary.totalPnl=%s\n", decimal(summary.totalPnl())));
        sb.append(String.format("summary.totalPnlPct=%s\n", decimal(summary.totalPnlPct())));
        sb.append(String.format("summary.cumulativePnl=%s\n", decimal(summary.cumulativePnl())));
        sb.append(String.format("positions.count=%d\n", positions == null ? 0 : positions.size()));

        if (allocations != null && !allocations.isEmpty()) {
            sb.append("allocations:\n");
            allocations.stream()
                    .sorted(Comparator.comparing(AllocationItemResponse::weight, Comparator.nullsLast(Comparator.reverseOrder())))
                    .forEach(item -> sb.append(String.format(
                            "- label=%s,value=%s,weightPct=%s,gain=%s,gainPct=%s,itemCount=%s\n",
                            safe(item.label()),
                            decimal(item.value()),
                            decimal(item.weight()),
                            decimal(item.gain()),
                            decimal(item.gainPct()),
                            item.itemCount()
                    )));
        }

        sb.append("positions:\n");
        if (positions == null || positions.isEmpty()) {
            sb.append("- empty=true\n");
        } else {
            positions.stream()
                    .sorted(Comparator.comparing(PositionResponse::portfolioWeight, Comparator.nullsLast(Comparator.reverseOrder())))
                    .forEach(position -> {
                        Asset asset = position.symbol() != null ? assetMapper.findBySymbol(position.symbol()) : null;
                        String displayName = position.assetName() != null ? position.assetName() : "未知资产";
                        String exchange = asset != null && asset.getExchange() != null ? asset.getExchange() : "未知交易所";
                        String assetType = asset != null && asset.getAssetType() != null ? asset.getAssetType() : "未知类型";
                        String sector = asset != null && asset.getSector() != null ? asset.getSector() : "未提供";
                        String currency = asset != null && asset.getCurrency() != null ? asset.getCurrency() : summary.baseCurrency();
                        String priceAsOf = position.priceAsOf() != null ? position.priceAsOf().toString() : "未提供";

                        sb.append(String.format(
                                "- symbol=%s,name=%s,assetType=%s,exchange=%s,sector=%s,quantity=%s,avgCost=%s,costBasis=%s,lastPrice=%s,marketValue=%s,unrealizedPnl=%s,unrealizedPnlPct=%s,portfolioWeight=%s,currency=%s,priceAsOf=%s\n",
                                safe(position.symbol()),
                                safe(displayName),
                                safe(assetType),
                                safe(exchange),
                                safe(sector),
                                decimal(position.quantity()),
                                decimal(position.avgCost()),
                                decimal(position.costBasis()),
                                decimal(position.lastPrice()),
                                decimal(position.marketValue()),
                                decimal(position.unrealizedPnl()),
                                decimal(position.unrealizedPnlPct()),
                                decimal(position.portfolioWeight()),
                                safe(currency),
                                safe(priceAsOf)
                        ));
                    });
        }
        return sb.toString();
    }

    private String decimal(BigDecimal value) {
        return value == null ? "N/A" : value.stripTrailingZeros().toPlainString();
    }

    private String safe(String value) {
        return value == null || value.isBlank() ? "N/A" : value;
    }
}
