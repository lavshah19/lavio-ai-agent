import { checkIfUserHasSubscription } from "@/action/subscription-action";
import { prisma } from "@/lib/prisma";
import { ChatGroq } from "@langchain/groq";
 // will make separate file later i am lazy :)
type FileUpload = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  storageUrl: string;
  embeddingId?: string | null;
};


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
export async function saveMessages(
  conversationId: string,
  userMessage: string,
  aiMessage: string,
  file: FileUpload[],
  userId: string
) {
  const [userMsg, aiMsg] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, role: "user", content: userMessage },
    }),
    prisma.message.create({
      data: { conversationId, role: "ai", content: aiMessage },
    }),
  ]);

  if (file.length > 0) {
    // Create file record first
    const savedFile = await prisma.fileUpload.create({
      data: {
        fileName: file[0].fileName,
        fileType: file[0].fileType,
        fileSize: file[0].fileSize,
        storageUrl: file[0].storageUrl,
        embeddingId: file[0].embeddingId,
        conversationId,
      },
    });

    // Attach to user message
    await prisma.fileAttachment.create({
      data: {
        messageId: userMsg.id,
        fileId: savedFile.id, // ✅ use saved file id
      },
    });
  }

  const hasSubscription = await checkIfUserHasSubscription();
  if (!hasSubscription) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        trialCount: {
          decrement: 1,
        },
      },
    });
  }


return {
  success: true,
  message: "Message saved successfully",
  AIMessage: {
    id: aiMsg.id,
    content: aiMsg.content,
    createdAt: aiMsg.createdAt,
    role: "ai",
  },

};
}
