"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoSparkles } from "react-icons/io5";
import { HiLightBulb } from "react-icons/hi";
import { RiChatSmile3Line } from "react-icons/ri";
import { useMessageStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { init, createId } from "@paralleldrive/cuid2";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import { FileAttachment } from "@/lib/types/fileType";
import ChatInput from "@/components/chat/ChatInput";
import { useFileUpload } from "@/lib/hooks/useFileUpload";

const Chat = () => {
  const [message, setMessage] = useState("");
  const { addMessage } = useMessageStore();

  const router = useRouter();

  const suggestedPrompts = [
    { icon: <HiLightBulb />, text: "Explain quantum computing" },
    { icon: <IoSparkles />, text: "Write a creative story" },
    { icon: <RiChatSmile3Line />, text: "Tell me a joke" },
  ];


  const fileContext = useFileUpload();
   const { conversationId,setConversationId } = fileContext;
  console.log(conversationId);
  async function handleSubmit() {
    const { uploadedFile, setUploadedFile, isUploading,} =
      fileContext;
    if (!message || isUploading) return;

    const messageId = createId();
    // const conversationId = init();

    const attachments: FileAttachment[] = uploadedFile
      ? [
          {
            id: `${messageId}`,
            messageId: createId(),
            fileId: uploadedFile.id,
            file: uploadedFile,
          },
        ]
      : [];

    addMessage({
      role: "user",
      content: message || "",
      attachedFiles: attachments,
    });

    setMessage("");
    setUploadedFile(null);
    router.push(`/chat/${conversationId}`);
  }

  useEffect(()=>{
    setConversationId(createId());
  },[])

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-900 flex justify-center items-center">
      <div className="max-w-4xl w-full px-6">
        {/* Welcome Section */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full blur-xl"></div>
              <IoSparkles className="text-6xl text-purple-400 relative" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hello! How can I help you today?
          </h1>
          <p className="text-gray-400 text-lg">
            Ask me anything or choose from suggestions below
          </p>
        </div>

        {/* Suggested Prompts */}
        <SuggestedPrompts
          suggestedPrompts={suggestedPrompts}
          setMessage={setMessage}
        />

        {/* Input Section */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-full"></div>
          <ChatInput
            value={message}
            onChange={setMessage}
            onSubmit={handleSubmit}
            fileContext={fileContext}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
