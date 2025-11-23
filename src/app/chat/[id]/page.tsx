"use client";
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/lib/store/store";
import { useParams } from "next/navigation";
import { ConversationWithAgentAction } from "@/action/chat-action";
import { getConversationMessages } from "@/action/chatQuery-action";
import { toast } from "sonner";
import { createId } from "@paralleldrive/cuid2";
import {
  ConversationFetchResponse,
  FileAttachment,
  Message,
} from "@/lib/types/fileType";
import ChatInput from "@/components/chat/ChatInput";
import { useFileUpload } from "@/lib/hooks/useFileUpload";
import MessageDisplay from "@/components/chat/MessageDisplay";

const SingleChat = () => {
  const [isThinking, setIsThinking] = useState(false);
  const param: { id: string } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const { initialMessage, clearMessages } = useMessageStore();
  const fileContext = useFileUpload();
  // Ref for auto-scroll
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const hasFetched = useRef(false);
   const {setConversationId,conversationId} = fileContext;
console.log(conversationId);
  async function fetchConversation() {
    const fetchedMessages: ConversationFetchResponse =
      (await getConversationMessages(param.id as string)) ?? [];

    if (fetchedMessages.success && fetchedMessages.conversations.length > 0) {
      const parsedMessages: Message[] = fetchedMessages.conversations;
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

  async function handleSend(initialMessage?: Message) {
    const { uploadedFile, setUploadedFile } = fileContext;
    const userContent = initialMessage?.content || inputValue;
    if (!userContent.trim()) return;
    const attachments: FileAttachment[] = initialMessage?.attachedFiles?.length
      ? initialMessage.attachedFiles
      : uploadedFile
      ? [
          {
            id: createId(),
            messageId: createId(),
            fileId: uploadedFile.id,
            file: uploadedFile,
          },
        ]
      : [];

    const newMessage: Message = {
      id: createId(),
      role: "user",
      content: userContent,
      attachedFiles: attachments,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue(""); 
    setUploadedFile(null);
    setIsThinking(true); 

    const formData = new FormData();
    formData.set("userMessage", userContent as string);
    formData.set("conversationId", param.id as string);
    formData.set(
      "file",
      JSON.stringify(newMessage?.attachedFiles.map((file) => file.file) || [])
    );

    try {
      const aiResponse = await ConversationWithAgentAction(formData);

      setIsThinking(false); 
        if (!aiResponse.success) {
    toast.error(aiResponse.message || "something went wrong");
    return;
  }

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
      setIsThinking(false); 
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred.");
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

      handleSend(initialMessage);
      //  clearMessages();
    } else {
      fetchConversation();
    }
  }, []);

  useEffect(()=>{
    if(param.id){
      setConversationId(param.id);
    }

  },[param.id])

  return (
    <div className="h-[calc(100vh-72px)] bg-gray-900 flex flex-col">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar">
        <MessageDisplay
          messages={messages}
          isThinking={isThinking}
          bottomRef={bottomRef}
        />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={() => handleSend()}
            fileContext={fileContext}
          />

          <div className="text-center mt-2">
            <p className="text-xs text-gray-600">
              Powered by AI • Type your message and press Enter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleChat;
