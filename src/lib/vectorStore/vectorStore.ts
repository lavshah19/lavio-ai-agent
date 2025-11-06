
import { QdrantVectorStore } from "@langchain/qdrant";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
export async function embeddingsToVectorDB() {
     const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACEHUB_API_KEY,
    model: "BAAI/bge-base-en-v1.5",
    provider: "hf-inference",
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    { url: "http://localhost:6333", collectionName:"my_collection" }
  );
    return vectorStore
}
