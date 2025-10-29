"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";

import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";

const tool = new TavilySearch({
  maxResults: 3,
  topic: "general",
  tavilyApiKey: process.env.TAVILY_API_KEY,
});

const checkpointer = new MemorySaver();
const tools = [tool];

const toolNode = new ToolNode(tools);

const model = new ChatGroq({
  model: "openai/gpt-oss-120b", // or "llama-3.1-8b-instant"
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
}).bindTools(tools);

async function mockLlm(state: any) {
  // here we will call the llm model here with the state
  // console.log("groq llm is calling ........");
  // console.log("state in mockllm ", state);
  const responseFromLLM = await model.invoke(state.messages);

  return { messages: [responseFromLLM] };
}
function shouldUseTool(state: any) {
  const lastMessage = state.messages[state.messages.length - 1];
  if (lastMessage.tool_calls.length > 0) {
    // console.log("inside tool tool:",state)
    return "tool_node";
  }

  // console.log("inside tool end:",state)
  return END;
}

const graph = new StateGraph(MessagesAnnotation)
  .addNode("mock_llm", mockLlm)
  .addNode("tool_node", toolNode)
  .addEdge(START, "mock_llm")
  .addEdge("tool_node", "mock_llm")
  .addConditionalEdges("mock_llm", shouldUseTool)
  .compile({ checkpointer });

export async function ConversationWithAgent(formData: FormData) {
  // 1. Get the current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized user");
  }

  try {
    const conversationId = formData.get("conversationId") as string;
    const aiResponse: string = await mainAgent(formData);


    // check if conversation already exist or not
    const isConversationAlreadyExisted = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });
    if (!isConversationAlreadyExisted) {

    const aiMsgForTitle = await model.invoke([
      {
        role: "system",
        content:
          "You are a helpful assistant. Generate a clear and concise title for the user's message. Return only the title text, without quotes or extra words.",
      },
      { role: "user", content: formData.get("userMessage") as string },
    ]);
      const conversation = await prisma.conversation.create({
        data: {
          id: conversationId,
          userId: session.user.id,
          title: aiMsgForTitle.content as string,
          model: "groq",
        },
      });
    }
    // 2. Create a new conversation

    // 3. Get the user's first message from form data
    const userMessage = formData.get("userMessage");
    if (typeof userMessage === "string" && userMessage.trim() !== "") {
      // 4. Save the message in the Message model

      // 5. Save the AI's response in the Message model
  const [userMsg, aiMsg] = await prisma.$transaction([
  prisma.message.create({ data: { conversationId, role: "user", content: userMessage } }),
  prisma.message.create({ data: { conversationId, role: "ai", content: aiResponse } })
]);

return {AIMessage:{id:aiMsg.id,content:aiMsg.content,createdAt:aiMsg.createdAt,role:"ai"}}

    }
  } catch (error) {
    console.error("Error creating user message:", error);
    throw new Error("Failed to create user message");
  }
}

async function mainAgent(formData: FormData): Promise<string> {
  const userMessage = formData.get("userMessage");
  const converstionId = formData.get("conversationId") as string;
  const langGraphConfig = {
    configurable: {
      thread_id: converstionId,
    },
  };

  const lastState = await graph.invoke(
    {
      messages: [{ role: "user", content: userMessage as string }],
    },
    langGraphConfig
  );

  return lastState.messages[lastState.messages.length - 1].content as string;
}
