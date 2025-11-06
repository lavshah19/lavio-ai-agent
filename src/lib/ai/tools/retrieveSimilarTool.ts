import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchConversation } from "@/lib/vectorStore/search/retriveVectoreDB"; // your similarity search function
import { Document } from "@langchain/core/documents";

/**
 * Tool: retrieve_similar
 * Description: Use this tool to find text chunks similar to a user's query, scoped to a specific conversation.
 */
export const retrieveSimilarTool = tool(
  async ({ query, conversationId }) => {
    try {
      // Perform similarity search in your vector DB
      const results: Document[] = await searchConversation(query, conversationId,5);

      if (!results.length) return "No similar documents found.";

      // Return concatenated page content of top results
      return results.map((doc, i) => `Chunk ${i + 1}: ${doc.pageContent}`).join("\n\n");
    } catch (error) {
      console.error("Error retrieving similar documents:", error);
      return "Failed to retrieve similar documents.";
    }
  },
  {
    name: "retrieve_similar",
    description:
      "Use this tool when you want to retrieve documents similar to a query from a specific conversation in the vector database.",
    schema: z.object({
      query: z.string().describe("The user's question or search query."),
      conversationId: z
        .string()
        .describe("The ID of the conversation you want to search within."),
 
    }),
  }
);
   //   topK: z
    //     .number()
    //     .optional()
    //     .describe("Number of top similar chunks to return (default 5)."),
    // 
