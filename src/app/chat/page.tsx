"use client";
import React, { useState, useRef } from "react";
import { IoSend, IoSparkles } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { BsMicFill } from "react-icons/bs";
import { HiLightBulb } from "react-icons/hi";
import { RiChatSmile3Line } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { useMessageStore } from "@/lib/store/store";
import { useRouter } from "next/navigation";
import { init, createId } from "@paralleldrive/cuid2";
import SuggestedPrompts from "@/components/chat/SuggestedPrompts";
import { deleteFileAction, uploadFileAction } from "@/action/Cloudinary-action";
import { AiOutlineFilePdf, AiOutlineClose } from "react-icons/ai";
import { toast } from "sonner";

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

export type UploadData = {
  public_id: string;
  format: string;
  bytes: number;
  secure_url: string;
  original_filename: string;
};

type UploadResult = {
  success: boolean;
  message: string;
  data: UploadData | null;
};

type DeleteResult = {
  success: boolean;
  message: string;
};

const Chat = () => {
  const [message, setMessage] = useState("");
  const { addMessage } = useMessageStore();
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null);
  const [isUploading, setIsUploading] = useState(false); // --- NEW STATE

  const suggestedPrompts = [
    { icon: <HiLightBulb />, text: "Explain quantum computing" },
    { icon: <IoSparkles />, text: "Write a creative story" },
    { icon: <RiChatSmile3Line />, text: "Tell me a joke" },
  ];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // --- handle file selection and upload ---
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (
      !["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type)
    ) {
      alert("Please select only PDF or image files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true); // disable send button
      const uploadResult: UploadResult = await uploadFileAction(formData);

      if (uploadResult?.success && uploadResult?.data) {
        const uploadedData = uploadResult.data;
        const fileData: FileUpload = {
          id: uploadedData.public_id,
          fileName: uploadedData.original_filename || "unknown",
          fileType: uploadedData.format,
          fileSize: uploadedData.bytes || null,
          storageUrl: uploadedData.secure_url,
        };
        setUploadedFile(fileData);
        toast.success("File uploaded successfully.");
      } else {
        alert("File upload failed. Try again.");
        
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading file.");
    } finally {
      setIsUploading(false); // re-enable after upload
    }
  };

  async function handleSubmit() {
    if (!message || isUploading) return;

    const messageId = createId();
    const conversationId = init();

    const attachments: FileAttachment[] = uploadedFile
      ? [
          {
            id: `${messageId}`,
            messageId:createId(),
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
    router.push(`/chat/${conversationId()}`);
  }

  async function handleDeleteFile() {
    try {
      if (uploadedFile) {
        const deleteResult: DeleteResult = await deleteFileAction(uploadedFile.id);
        if (deleteResult.success) {
          setUploadedFile(null);
          toast.success(deleteResult.message || "File deleted");
        } else {
          console.error(deleteResult.message);
          toast.error(deleteResult.message || "Failed to delete file");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Something went wrong");
    }
  }

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

          <div className="relative flex flex-col gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-3 shadow-2xl hover:border-gray-600 transition-all duration-300 focus-within:border-purple-500">
            
            {/* Hidden File Input */}
            <input
              type="file"
              accept=".pdf,image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Uploaded File Preview */}
            {uploadedFile && (
              <div className="flex items-center gap-2 bg-gray-700/50 p-2 rounded-lg">
                {uploadedFile.fileType.includes("pdf") ? (
                  <AiOutlineFilePdf className="text-red-400 text-2xl" />
                ) : (
                  <img
                    src={uploadedFile.storageUrl}
                    alt={uploadedFile.fileName}
                    className="w-10 h-10 object-cover rounded-md border border-gray-600"
                  />
                )}
                <span className="text-white text-sm truncate max-w-[150px]">
                  {uploadedFile.fileName}
                </span>
                <button
                  onClick={handleDeleteFile}
                  className="ml-auto text-gray-400 hover:text-red-400"
                >
                  <AiOutlineClose className="text-xl" />
                </button>
              </div>
            )}

            {/* Chat Input Row */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAttachmentClick}
                className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200"
                disabled={isUploading}
              >
                <FiPaperclip className="text-xl" />
              </button>

              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isUploading ? "Uploading..." : "Ask me anything..."}
                className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-500 border-none focus:outline-none text-lg focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) =>
                  e.key === "Enter" && message && !isUploading && handleSubmit()
                }
                disabled={isUploading}
              />

              <button
                className={`p-3 rounded-full transition-all duration-300 ${
                  message && !isUploading
                    ? "bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!message || isUploading}
                onClick={handleSubmit}
              >
                <IoSend className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
