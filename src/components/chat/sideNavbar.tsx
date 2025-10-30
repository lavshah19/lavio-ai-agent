"use client";
import React, { useState, useEffect } from "react";
import { TbSquareToggle } from "react-icons/tb";
import { MdAddToPhotos, MdDeleteOutline } from "react-icons/md";
import { Button } from "../ui/button";
import { useIsopen, useMessageStore } from "@/lib/store/store";
import { getUserConversations, deleteUserConversation } from "@/action/chatQuery-action";
// <-- import your delete action
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // optional: use toast for feedback

type Conversation = {
  id: string;
  userId: string;
  title: string | null;
  model: string | null;
  createdAt: Date;
  updatedAt: Date;
};
type ServerActionResponse = {
  success: boolean;
  message: string;
  conversations?: Conversation[];
};

const SideNavbar = () => {
  const { isOpen, setIsOpen } = useIsopen();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const router = useRouter();
  const { initialMessage, clearMessages } = useMessageStore();


  useEffect(() => {
    fetchAllConversations();
  }, [initialMessage]);

  async function fetchAllConversations() {
    try {
      const listOfConversations:ServerActionResponse = await getUserConversations();
      setConversations(listOfConversations.conversations || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeleteConversation(id: string) {
    try {
      const res:ServerActionResponse = await deleteUserConversation(id);

      if (res?.success) {
        toast.success(res.message || "Conversation deleted");
        // remove deleted conversation from state
        setConversations((prev) => prev.filter((c) => c.id !== id));
        router.push("/chat"); // redirect to chat home after deletion
      } else {
        toast.error(res?.message || "Failed to delete conversation");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-72px)] border-r border-gray-500 bg-gray-900 text-white flex flex-col p-4 transition-transform duration-300 gap-5 ${
          isOpen ? "translate-x-0" : "-translate-x-[75%]"
        }  w-64 z-5`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3
            className={`text-xl font-semibold ${
              isOpen ? "text-center" : "text-right"
            } `}
          >
            Lavio
          </h3>

          <TbSquareToggle
            onClick={() => setIsOpen()}
            size={24}
            className={`cursor-pointer transition-transform ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>

        {/* New Chat Button */}
        {isOpen && (
          <Button
            onClick={() => router.push("/chat")}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 mb-4 w-full"
          >
            <MdAddToPhotos />
            New Chat
          </Button>
        )}
        {!isOpen && (
          <div  onClick={() => router.push("/chat")} className="flex justify-end font-bold mt-4 cursor-pointer">
            <MdAddToPhotos size={20} />
          </div>
        )}

        {/* Chat List */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center justify-between bg-gray-800 p-2 rounded mb-2 hover:bg-gray-700 group "
              >
                <button
                  onClick={() => router.push(`/chat/${chat.id}`)}
                  className="truncate text-left flex-1 cursor-pointer"
                >
                  {chat.title || "Untitled Chat"}
                </button>

                <MdDeleteOutline
                  size={20}
                  onClick={() => handleDeleteConversation(chat.id)}
                  className="text-red-400 opacity-70 hover:opacity-100 hover:text-red-500 cursor-pointer transition hidden group-hover:block"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNavbar;
