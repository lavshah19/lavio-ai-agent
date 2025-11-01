"use server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { headers } from "next/headers";
import { success } from "zod";

// get conversation message
export async function getConversationMessages(conversationId: string) {
  // 1. Get the current user session
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized user");
    }

      const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return { success: false, message: "Conversation does not exist",conversations:[] };
    }

    // Optional: check ownership (if conversation has userId field)
    if (conversation.userId !== session.user.id) {
      return { success: false, message: "You do not own this conversation",conversations:[]};
    }

    // 2. Fetch messages for the conversation
    // const messages = await prisma.message.findMany({
    //   where: { conversationId },
    //   orderBy: { createdAt: "asc" },
    // });

  // after i add files upload feature i wiil use this reminder
     const messages = await prisma.message.findMany({
      where: { conversationId },
      include:{
        attachedFiles:{
          include: {
            file: true,
          }
        }
      },
      orderBy: { createdAt: "asc" },
    });

    return { success: true, message: "conversation fetch sucesfully",conversations:messages }; 
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
        return { success: false, message: "conversation fetch sucesfully",conversations:[] }; 

  }
}




// [
//   {
//     id: "msg1",
//     role: "user",
//     content: "What is in this image?",
//     attachedFiles: [
//       {
//         id: "attach1",
//         file: {
//           id: "file1",
//           fileName: "dog.png",
//           fileType: "image/png",
//           storageUrl: "https://your-cloud-storage/dog.png"
//         }
//       }
//     ]
//   },
//   {
//     id: "msg2",
//     role: "ai",
//     content: "It looks like a brown dog sitting on grass.",
//     attachedFiles: []
//   }
// ]

// get all conversations for user
export async function getUserConversations() {
  // 1. Get the current user session
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized user");
    }

    // 2. Fetch conversations for the user
    const conversations = await prisma.conversation.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    });
     return { success: true, message: "conversation fetch sucesfully",conversations:conversations };
   
  } catch (error) {
    console.error("Error fetching user conversations:", error);
      return { success: true, message: "conversation fetch sucesfully",conversations:[] };
  }
}
//delete conversation

export async function deleteUserConversation(conversationId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized user" };
    }

    // Check if the conversation exists and belongs to the logged-in user
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return { success: false, message: "Conversation does not exist" };
    }

    // Optional: check ownership (if conversation has userId field)
    if (conversation.userId !== session.user.id) {
      return { success: false, message: "You do not own this conversation" };
    }

    // Delete the conversation
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { success: true, message: "Conversation deleted successfully" };
  } catch (error) {
    console.error("Error deleting user conversation:", error);
    return { success: false, message: "Server error while deleting conversation" };
  }
}
