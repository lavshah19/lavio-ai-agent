import { prisma } from "@/lib/prisma";
import { ChatGroq } from "@langchain/groq";

/** Create a conversation if not existing */
export async function ensureConversationExists(
  conversationId: string,
  userId: string,
  userMessage: string,
  model: ChatGroq
) {
  const existing = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (existing) return;

  const aiMsgForTitle = await model.invoke([
    {
      role: "system",
      content:
        "You are a helpful assistant. Generate a clear and concise title for the user's message. Return only the title text, without quotes or extra words.",
    },
    { role: "user", content: userMessage },
  ]);

  await prisma.conversation.create({
    data: {
      id: conversationId,
      userId,
      title: aiMsgForTitle.content as string,
      model: "groq",
    },
  });
}

/** Save both the user and AI messages */
export async function saveMessages(conversationId: string, userMessage: string, aiMessage: string) {
  const [userMsg, aiMsg] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, role: "user", content: userMessage },
    }),
    prisma.message.create({
      data: { conversationId, role: "ai", content: aiMessage },
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
}