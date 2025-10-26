"use client";
import React, { Activity, useState } from "react";
import { TbSquareToggle } from "react-icons/tb";
import { MdAddToPhotos } from "react-icons/md";
import { Button } from "../ui/button";
const SideNavbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState([
    { id: 1, title: "Chat with AI 1" },
    { id: 2, title: "Project discussion" },
    { id: 3, title: "Random questions" },
  ]);

  const createNewChat = () => {
    const newChat = { id: Date.now(), title: `New Chat ${chats.length + 1}` };
    setChats([newChat, ...chats]);
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100%-64px)] border-r border-gray-500 bg-gray-900 text-white flex flex-col p-4 transition-transform duration-300 gap-5 ${
          isOpen ? "translate-x-0" : "-translate-x-[75%]"
        }  w-64 z-5`}
      >
        {/* New Chat Button */}
        <div className="flex justify-between">
          <h3
            className={`text-xl font-semibold ${
              isOpen ? "text-center" : "text-right"
            } `}
          >
            Lavio
          </h3>

          <TbSquareToggle onClick={() => setIsOpen(!isOpen)} size={24} className={`${isOpen?"rotate-0":"rotate-180"}`} />
        </div>

        <Activity mode={isOpen ? "visible" : "hidden"}>
          <Button
            onClick={createNewChat}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 mb-4 w-full"
          >
            <MdAddToPhotos />
            New Chat
          </Button>
        </Activity>
        {!isOpen && (
          <div className="flex justify-end font-bold mt-4">
          
            <MdAddToPhotos size={20} />
          </div>
        )}

        {/* Chat List */}
        <Activity mode={isOpen ? "visible" : "hidden"}>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <Button
                key={chat.id}
                className="bg-gray-800 p-3 rounded mb-2 hover:bg-gray-700 cursor-pointer truncate w-full"
              >
                {chat.title}
              </Button>
            ))}
          </div>
        </Activity>
      </div>
    </div>
  );
};

export default SideNavbar;
