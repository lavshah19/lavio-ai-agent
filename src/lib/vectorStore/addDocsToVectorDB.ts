import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddingsToVectorDB } from "./vectorStore";
import { Document } from "@langchain/core/documents";

export async function addDocsToVectorDB(docs: Document[], conversationId: string) {
  const vectorStore = await embeddingsToVectorDB();

  // Split large docs into smaller chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.splitDocuments(docs);

  // Convert chunks into proper Document instances with metadata
  const chunksWithMetadata: Document[] = chunks.map(
    (chunk) =>
      new Document({
        pageContent: chunk.pageContent,
        metadata: { ...chunk.metadata, conversationId },
      })
  );

  // Add documents to vector DB
  await vectorStore.addDocuments(chunksWithMetadata);
}






