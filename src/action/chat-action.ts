// adjust if using another auth
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";


export async function initialConversationWithAgent(formData: FormData) {
  // 1. Get the current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized user");
  }

  // 2. Create a new conversation
  const conversation = await prisma.conversation.create({
    data: {
    
      userId: session.user.id,
      title: "New Chat",
      model: "groq",
    },
  });

  try {
    // 3. Get the user's first message from form data
    const userMessage = formData.get("userMessage");
    if (typeof userMessage === "string" && userMessage.trim() !== "") {
      // 4. Save the message in the Message model
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "user", // MessageRole enum
          content: userMessage,
        },
      });
    }

    // 5. Return the conversation ID to the client
    return { conversationId: conversation.id };
  } catch (error) {
    console.error("Error creating user message:", error);
    throw new Error("Failed to create user message");
  }
}
