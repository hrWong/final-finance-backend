import React, { useState, useEffect, useRef } from "react";
import { Send, X, Bot, TrendingUp, PieChart, ShieldAlert } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AISidebarProps {
  onClose: () => void;
}

/**
 * 纯文本渲染组件，支持换行和基础间距。
 * 配合后端“禁用 Markdown”指令，实现最清晰的显示效果。
 */
const FormattedText = ({ text, isUser }: { text: string, isUser?: boolean }) => {
  if (!text) return null;
  return (
    <div className="space-y-1.5 break-words">
      {text.split("\n").map((line, i) => (
        <p key={i} className={line.trim() === "" ? "h-2" : ""}>
          {line}
        </p>
      ))}
    </div>
  );
};

export function AISidebar({ onClose }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "您好。我是您的 AI 投资顾问。我可以为您提供专业的投资组合深度分析及市场见解。请问今天有什么可以帮您的？",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      const response = await fetch("http://localhost:8088/api/ai/stream-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      if (reader) {
        setIsTyping(false);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data:")) {
              const content = line.slice(5);
              accumulatedContent += content;

              setMessages((prev) =>
                prev.map(msg =>
                  msg.id === aiMessageId
                    ? { ...msg, content: accumulatedContent }
                    : msg
                )
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("AI Streaming error:", error);
      setMessages((prev) =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, content: "抱歉，连接 AI 服务时出现异常，请检查网络或稍后重试。" }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">AI 投资顾问</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] text-slate-500 font-medium">实时分析中</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex gap-3 max-w-[88%] ${msg.role === "user" ? "flex-row" : "flex-row"}`}
              style={{ flexDirection: msg.role === "user" ? "row-reverse" : "row" }}
            >
              {/* Avatar Slot */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden border ${msg.role === "user" ? "bg-indigo-600 border-indigo-500" : "bg-white border-slate-200"
                }`}>
                {msg.role === "user" ? (
                  <img src="/assets/user_avatar.png" alt="User" className="w-full h-full object-cover" />
                ) : (
                  <img src="/assets/ai_avatar.png" alt="AI" className="w-full h-full object-cover" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`p-4 rounded-2xl shadow-md text-[14px] leading-[1.6] ${msg.role === "user"
                ? "bg-indigo-700 text-white rounded-tr-none"
                : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none"
                }`}
                style={{
                  backgroundColor: msg.role === "user" ? "#3730a3" : "#f8fafc", // 手推 bg-indigo-800
                  color: msg.role === "user" ? "#ffffff" : "#1e293b",
                  whiteSpace: "pre-wrap"
                }}>
                <FormattedText text={msg.content} isUser={msg.role === "user"} />
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 animate-pulse overflow-hidden">
                <img src="/assets/ai_avatar.png" alt="AI" className="w-full h-full object-cover grayscale" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 text-xs italic">
                正在深度审视资产负债表与盈亏波动...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length < 3 && (
        <div className="px-4 py-2 flex flex-wrap gap-2 mb-2">
          <button
            onClick={() => handleSend("分析我的持仓，并给出个股建议")}
            className="px-3 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
          >
            <TrendingUp className="w-3 h-3" />
            持仓深度分析
          </button>
          <button
            onClick={() => handleSend("我的风险敞口是否过大？")}
            className="px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-600 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3 h-3" />
            风险压力测试
          </button>
          <button
            onClick={() => handleSend("如何优化资产配置占比？")}
            className="px-3 py-1.5 rounded-full border border-sky-200 bg-sky-50 text-sky-600 text-xs font-semibold hover:bg-sky-100 transition-colors flex items-center gap-1.5"
          >
            <PieChart className="w-3 h-3" />
            配置调仓建议
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="询问持仓建议、个股动态..."
              className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="mt-2 text-[10px] text-center text-slate-400 font-medium italic">
          注意：AI 建议仅供参考，投资有风险，决策需谨慎。
        </p>
      </div>
    </div>
  );
}
