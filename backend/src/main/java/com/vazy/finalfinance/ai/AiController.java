package com.vazy.finalfinance.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // 允许前端跨域调用
public class AiController {

    private final AiAdvisorService aiAdvisorService;

    /**
     * 流式对话接口
     * @param body 包含 prompt 的请求体
     * @return SSE Emitter
     */
    @PostMapping(value = "/stream-chat", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamChat(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "你好");
        return aiAdvisorService.streamChat(prompt);
    }
}
