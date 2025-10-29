"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoSend, IoSparkles } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { BsMicFill } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { useMessageStore } from "@/lib/store/store";
import { useParams } from "next/navigation";
import { ConversationWithAgent } from "@/action/chat-action";
import Markdown from "react-markdown";
import { getConversationMessages } from "@/action/chatQuery-action";

const SingleChat = () => {
  type Message = {
    id: string;
    role: "user" | "ai" | "system";
    content: string | null;
    createdAt: Date;
  };

  const param = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { initialMessage, clearMessages } = useMessageStore();

  // Ref for auto-scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);

async function fetchConversation() {
  const fetchedMessages = (await getConversationMessages(param.id as string)) ?? [];

  const parsedMessages = fetchedMessages.map((msg) => ({
    ...msg,
    createdAt: new Date(msg.createdAt),
  }));

  setMessages(parsedMessages);
}


  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle input change
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  // Handle send
  async function handleSend(initialMessage?:string) {
    if (!inputValue.trim()&&!initialMessage?.trim()) return;

    const newMessage: Message = {
      id: Date.now().toLocaleString(),
      role: "user",
      content:  initialMessage || inputValue,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    const formData = new FormData();
    formData.set("userMessage", initialMessage || inputValue);
    formData.set("conversationId", param.id as string);

    const aiResponse = await ConversationWithAgent(formData);
    if (aiResponse) {
      const aiMessage: Message = {
        id: Date.now().toLocaleString(),
        role: "ai",
        content: aiResponse.AIMessage.content || "",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }

    clearMessages();
  }

  useEffect(() => {
    if (initialMessage) {
      // setMessages([initialMessage]);
      // handleSend(initialMessage?.content)
       clearMessages();
    } else {
      fetchConversation();
    }
  }, []);

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-900 flex flex-col">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.role === "user" ? "order-2" : "order-1"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gray-800 text-gray-100 border border-gray-700"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <IoSparkles className="text-purple-400" />
                      <span className="text-sm font-semibold text-purple-400">
                        Lavio
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap wrap-break-word hide-scrollbar overflow-x-auto prose prose-invert max-w-none">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
                {/* <p
                  className={`text-xs text-gray-500 mt-1 px-2 ${
                    msg.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.createdAt.toLocaleString()}
                </p> */}
              </div>
            </div>
          ))}
          {/* 👇 Invisible div to scroll into view */}
          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-full"></div>

            <div className="relative flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full px-2 py-1 shadow-2xl hover:border-gray-600 transition-all duration-300 focus-within:border-purple-500">
              {/* Attachment */}
              <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
                <FiPaperclip className="text-xl" />
              </button>

              {/* Input */}
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg border-none focus:ring-0"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              {/* Mic */}
              <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
                <BsMicFill className="text-xl" />
              </button>

              {/* Send */}
              <button
                onClick={()=>handleSend}
                className={`p-3 rounded-full transition-all duration-300 ${
                  inputValue
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!inputValue}
              >
                <IoSend className="text-xl" />
              </button>
            </div>
          </div>

          <div className="text-center mt-2">
            <p className="text-xs text-gray-600">
              Powered by AI • Type your message or use voice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
