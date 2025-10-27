"use client";
import React, { useEffect, useState } from "react";
import { IoSend, IoSparkles } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { BsMicFill } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { useMessageStore } from "@/lib/store/store";

const SingleChat =  () => {
  type Message = {
    id: number;
    sender: "user" | "ai";
    text: string;
    time: string;
  };
  const [message, setMessage] = useState("");
  const { messages: msg, clearMessages } = useMessageStore();
  console.log(msg);
  // Dummy chat data
  const dummyMessages = [...msg]; // correct

  async function fetchConversation() {
    /* 

here i will use the conversation id to fetch the past what data */
  }

  useEffect(() => {
    fetchConversation();
    
  }, []);

  // make second use effect to sent the data to backend and after that my AI agent response can be received by user

  return (
    <div className="h-[calc(100vh-72px)]  bg-gray-900 flex flex-col">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide ">
        <div className="max-w-4xl mx-auto space-y-4">
          {dummyMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.sender === "user" ? "order-2" : "order-1"
                }`}
              >
                {/* Message Bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.sender === "user"
                      ? "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                      : "bg-gray-800 text-gray-100 border border-gray-700"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <IoSparkles className="text-purple-400" />
                      <span className="text-sm font-semibold text-purple-400">
                        AI Assistant
                      </span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                {/* Time */}
                <p
                  className={`text-xs text-gray-500 mt-1 px-2 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Section - Fixed at Bottom */}
      <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-full"></div>

            <div className="relative flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full px-2 py-1 shadow-2xl hover:border-gray-600 transition-all duration-300 focus-within:border-purple-500">
              {/* Attachment Button */}
              <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
                <FiPaperclip className="text-xl" />
              </button>

              {/* Input Field */}
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) =>
                  e.key === "Enter" && message && console.log("Send:", message)
                }
              />

              {/* Mic Button */}
              <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
                <BsMicFill className="text-xl" />
              </button>

              {/* Send Button */}
              <button
                className={`p-3 rounded-full transition-all duration-300 ${
                  message
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!message}
              >
                <IoSend className="text-xl" />
              </button>
            </div>
          </div>

          {/* Optional: Powered by or additional info */}
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
