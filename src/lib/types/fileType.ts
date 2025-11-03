export type FileUpload = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  storageUrl: string;
  embeddingId?: string | null;
};

export type FileAttachment = {
  id: string;
  messageId: string;
  fileId: string;
  file: FileUpload;
};

export type Message = {
  id: string;
  role: "user" | "ai" | "system";
  content: string | null;
  attachedFiles: FileAttachment[]; // added relation
};

export type ConversationFetchResponse = {
  success: boolean;
  message: string;
  conversations: Message[];
};
export type UploadData = {
  public_id: string;
  format: string;
  bytes: number;
  secure_url: string;
  original_filename: string;
};
export type UploadResult = {
  success: boolean;
  message: string;
  data: UploadData | null;
};

export type DeleteResult = {
  success: boolean;
  message: string;
};