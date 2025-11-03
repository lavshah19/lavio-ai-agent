"use client";
import React, { SetStateAction } from "react";
import { IoSend } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import FilePreview from "./FilePreview";
import { useFileUpload } from "@/lib/hooks/useFileUpload";


interface ChatInputProps {
  value: string;
  onChange:  React.Dispatch<SetStateAction<string>>;
  onSubmit: () => void;
   fileContext: ReturnType<typeof useFileUpload>;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSubmit, fileContext }) => {
 const {
    fileInputRef,
    handleAttachmentClick,
    handleFileChange,
    handleDeleteFile,
    uploadedFile,
    isUploading,
  } = fileContext;

  return (
    <div className="relative flex flex-col gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-3 shadow-2xl hover:border-gray-600 transition-all duration-300 focus-within:border-purple-500">
      <input
        type="file"
        accept=".pdf,image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {uploadedFile && (
        <FilePreview file={uploadedFile} onDelete={handleDeleteFile} />
      )}

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
          value={isUploading ? "Uploading..." : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isUploading ? "Uploading..." : "Ask me anything..."}
          className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-500 border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => e.key === "Enter" && !isUploading && onSubmit()}
          disabled={isUploading}
        />

        <button
          onClick={onSubmit}
          disabled={!value || isUploading}
          className={`p-3 rounded-full transition-all duration-300 ${
            value && !isUploading
              ? "bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          <IoSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;