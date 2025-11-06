"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { uploadFileAction, deleteFileAction } from "@/action/Cloudinary-action";
import { DeleteResult, FileUpload, UploadResult } from "../types/fileType";
import { createId } from "@paralleldrive/cuid2";
import { useConversationStore } from "../store/store";


export function useFileUpload() {
  const [uploadedFile, setUploadedFile] = useState<FileUpload | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
   const {conversationId,setConversationId}=useConversationStore();

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Please select only PDF or image files.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("conversationId", conversationId);

    try {
      setIsUploading(true);
      const uploadResult: UploadResult = await uploadFileAction(formData);
      if (uploadResult.success && uploadResult.data) {
        const d = uploadResult.data;
        setUploadedFile({
          id: d.public_id,
          fileName: d.original_filename || "unknown",
          fileType: d.format,
          fileSize: d.bytes || null,
          storageUrl: d.secure_url,
        });
        toast.success("File uploaded successfully.");
      } else {
        toast.error("File upload failed.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async () => {
    try {
      if (!uploadedFile) return;
      const del: DeleteResult = await deleteFileAction(uploadedFile.id);
      if (del.success) {
        setUploadedFile(null);
        toast.success(del.message || "File deleted");
      } else {
        toast.error(del.message || "Failed to delete file");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Something went wrong while deleting.");
    }
  };

  return {
    fileInputRef,
    handleAttachmentClick,
    handleFileChange,
    handleDeleteFile,
    uploadedFile,
    isUploading,
    setUploadedFile,
    setIsUploading,
    conversationId,
    setConversationId
  };
}