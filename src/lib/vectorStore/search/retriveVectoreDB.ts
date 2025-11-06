import { Document } from "@langchain/core/documents";
import { embeddingsToVectorDB } from "../vectorStore";

export async function searchConversation(
  query: string,
  conversationId: string,
  k = 5
): Promise<Document[]> {
  const vectorStore = await embeddingsToVectorDB();

  // Qdrant filter syntax — must prefix metadata fields
  const filter = {
    must: [
      { key: "metadata.conversationId", match: { value: conversationId } },
    ],
  };

  const results = await vectorStore.similaritySearch(query, k, filter);
  return results;
}
