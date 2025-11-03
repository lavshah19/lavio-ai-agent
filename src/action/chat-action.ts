"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ensureConversationExists, saveMessages } from "@/lib/ai/conversationService";
import { validateFormData } from "@/lib/validation/conversationSchema";
import { baseModel } from "@/lib/ai/model";
import { mainAgent } from "@/lib/ai/mainAgent";



export async function ConversationWithAgentAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) throw new Error("Unauthorized user");

  const { userMessage, conversationId } = validateFormData(formData);

  try {
    // Run AI processing
    const aiResponse = await mainAgent(userMessage, conversationId);

    // Ensure conversation and persist messages
    await ensureConversationExists(conversationId, session.user.id, userMessage, baseModel);
    return await saveMessages(conversationId, userMessage, aiResponse);
  } catch (error) {
    console.error("Error creating conversation or messages:", error);
    throw new Error("Failed to process conversation");
  }
}