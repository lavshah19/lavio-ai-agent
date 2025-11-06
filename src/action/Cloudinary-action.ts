"use server";

import cloudinary from "@/lib/cloudinary/cloudinary";
import type { DeleteResult } from "@/lib/types/cloudinary/cloudinary";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { writeFile, mkdir } from "fs/promises";
import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";


import path from "path";
import { addDocsToVectorDB } from "@/lib/vectorStore/addDocsToVectorDB";

export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file found in request");
    const conversationId = formData.get("conversationId") as string;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

if (file.type === "application/pdf") {
      // Create uploads folder if not exist
      const uploadDir = path.join(process.cwd(), "uploads");
      await mkdir(uploadDir, { recursive: true });

      // Define local file path
      const filePath = path.join(uploadDir, file.name);

      // Save file locally
      await writeFile(filePath, buffer);

      // Load and process PDF
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      // Convert to embeddings and save to vector DB
       await addDocsToVectorDB(docs, conversationId);
      console.log("PDF loaded and processed");
    }
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "chat",
          resource_type: "auto",
        
        },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) return reject(error);
          if (!result) return reject(new Error("No result from Cloudinary"));
          resolve(result);
        }
      );

      stream.end(buffer);
    });

    return {
      success: true,
      data: {
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        secure_url: uploadResult.secure_url,
        original_filename: uploadResult.original_filename,
      },
      message: "File uploaded successfully",
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, data: null, message: "File upload failed" };
  }
}



export async function deleteFileAction(publicId: string): Promise<DeleteResult> {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    return {
      success: true,
      message: "File deleted successfully",
   
    };
  } catch (error: any) {
    console.error("Delete failed:", error);
    return {
      success: false,
      message: error.message || "File deletion failed",
    };
  }
}