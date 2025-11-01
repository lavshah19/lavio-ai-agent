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
import { toast } from "sonner";
import { init, createId } from "@paralleldrive/cuid2";
import Thinking from "@/components/chat/Thinking";
type FileUpload = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  storageUrl: string;
  embeddingId?: string | null;
};

type FileAttachment = {
  id: string;
  messageId: string;
  fileId: string;
  file: FileUpload;
};

type Message = {
  id: string;
  role: "user" | "ai" | "system";
  content: string | null;
  attachedFiles: FileAttachment[]; // added relation
};

type ConversationFetchResponse = {
  success: boolean;
  message: string;
  conversations: Message[];
};
const SingleChat = () => {
  const [isThinking, setIsThinking] = useState(false);
  const param = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { initialMessage, clearMessages } = useMessageStore();

  // Ref for auto-scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasFetched = useRef(false);

  async function fetchConversation() {
    const fetchedMessages: ConversationFetchResponse =
      (await getConversationMessages(param.id as string)) ?? [];

    if (fetchedMessages.success && fetchedMessages.conversations.length > 0) {
      const parsedMessages = fetchedMessages.conversations;
      setMessages(parsedMessages);
    } else {
      toast.error(fetchedMessages.message || "something went wrong");
      setMessages([]);
    }
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
  // ... inside SingleChat component

  async function handleSend(initialMessage?: string | null) {
    const userContent = initialMessage || inputValue;
    if (!userContent.trim()) return;

    const newMessage: Message = {
      id: createId(),
      role: "user",
      content: userContent,
      attachedFiles: [],
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue(""); // Clear input immediately for better UX
    setIsThinking(true); // <-- START thinking

    const formData = new FormData();
    formData.set("userMessage", userContent as string);
    formData.set("conversationId", param.id as string);

    try {
      const aiResponse = await ConversationWithAgent(formData);

      setIsThinking(false); // <-- STOP thinking

      if (aiResponse?.AIMessage) {
        const aiMessage: Message = {
          id: createId(),
          role: "ai",
          content:
            aiResponse.AIMessage.content || "Sorry, I encountered an issue.",
          attachedFiles: [],
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        // Handle cases where response is not as expected
        toast.error("Failed to get a response from the AI.");
      }
    } catch (error) {
      console.error("Error in ConversationWithAgent:", error);
      setIsThinking(false); // <-- STOP thinking on error too
      toast.error("An unexpected error occurred.");
    }

    if (initialMessage) {
      clearMessages();
    }
  }

  useEffect(() => {
    if (initialMessage) {
      // setMessages([initialMessage]);
      if (hasFetched.current) return;
      hasFetched.current = true;

      handleSend(initialMessage?.content);
      //  clearMessages();
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

                  {/* ✅ New Section: show attached images */}
                  {msg.attachedFiles?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.attachedFiles.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="relative group w-32 h-32 overflow-hidden rounded-lg border border-gray-700 hover:border-purple-500 transition-all"
                        >
                          {attachment.file.fileType.startsWith("image/") ? (
                            <img
                              src={attachment.file.storageUrl}
                              alt={attachment.file.fileName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 bg-gray-900">
                              {attachment.file.fileName}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isThinking && <Thinking />}
          {/*  Invisible div to scroll into view */}
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
                className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              {/* Mic */}
              <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
                <BsMicFill className="text-xl" />
              </button>

              {/* Send */}
              <button
                onClick={() => handleSend()}
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
