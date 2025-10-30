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

import z from "zod";

const tool = new TavilySearch({
  maxResults: 3,
  topic: "general",
  tavilyApiKey: process.env.TAVILY_API_KEY,
});

const FormDataSchema = z.object({
  userMessage: z.string(),
  conversationId: z.string(),
});
export type FormDtaFormValues = z.infer<typeof FormDataSchema>;

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
    const validateFormData = FormDataSchema.parse({
      userMessage: formData.get("userMessage"),
      conversationId: formData.get("conversationId"),
    });
    const aiResponse: string = await mainAgent(validateFormData);

    // check if conversation already exist or not
    const isConversationAlreadyExisted = await prisma.conversation.findUnique({
      where: { id: validateFormData.conversationId },
    });
    if (!isConversationAlreadyExisted) {
      const aiMsgForTitle = await model.invoke([
        {
          role: "system",
          content:
            "You are a helpful assistant. Generate a clear and concise title for the user's message. Return only the title text, without quotes or extra words.",
        },
        { role: "user", content: validateFormData.userMessage },
      ]);
      const conversation = await prisma.conversation.create({
        data: {
          id: validateFormData.conversationId,
          userId: session.user.id,
          title: aiMsgForTitle.content as string,
          model: "groq",
        },
      });
    }
    // 2. Create a new conversation

    // 3. Get the user's first message from form data

    // 4. Save the message in the Message model

    // 5. Save the AI's response in the Message model
    const [userMsg, aiMsg] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId: validateFormData.conversationId,
          role: "user",
          content: validateFormData.userMessage,
        },
      }),
      prisma.message.create({
        data: {
          conversationId: validateFormData.conversationId,
          role: "ai",
          content: aiResponse,
        },
      }),
    ]);

    return {
      AIMessage: {
        id: aiMsg.id,
        content: aiMsg.content,
        createdAt: aiMsg.createdAt,
        role: "ai",
      },
    };
  } catch (error) {
    console.error("Error creating user message:", error);
    throw new Error("Failed to create user message");
  }
}

async function mainAgent(formData: FormDtaFormValues): Promise<string> {
  const userMessage = formData.userMessage;
  const converstionId = formData.conversationId;
  const langGraphConfig = {
    configurable: {
      thread_id: converstionId,
    },
  };
  const systemMessage =
    "You are a helpful expert who provides concise answers.";

  const initialState = {
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  };

  // Now, invoke the graph with this initial state
  const lastState = await graph.invoke(initialState, langGraphConfig);

  const lastMessage = lastState.messages.at(-1);

  if (!lastMessage) throw new Error("No messages found in lastState");

  if (typeof lastMessage.content !== "string") {
    throw new Error("Unexpected message content type");
  }

  return lastMessage.content;
}
