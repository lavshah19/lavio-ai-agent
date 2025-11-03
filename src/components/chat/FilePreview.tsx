"use client";
import { FileUpload } from "@/lib/types/fileType";
import React from "react";
import { AiOutlineFilePdf, AiOutlineClose } from "react-icons/ai";


interface FilePreviewProps {
  file: FileUpload;
  onDelete: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onDelete }) => (
  <div className="flex items-center gap-2 bg-gray-700/50 p-2 rounded-lg">
    {file.fileType.includes("pdf") ? (
      <AiOutlineFilePdf className="text-red-400 text-2xl" />
    ) : (
      <img
        src={file.storageUrl}
        alt={file.fileName}
        className="w-10 h-10 object-cover rounded-md border border-gray-600"
      />
    )}
    <span className="text-white text-sm truncate max-w-[150px]">
      {file.fileName}
    </span>
    <button
      onClick={onDelete}
      className="ml-auto text-gray-400 hover:text-red-400"
    >
      <AiOutlineClose className="text-xl" />
    </button>
  </div>
);

export default FilePreview;