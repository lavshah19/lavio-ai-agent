"use client";
import React, { useState } from 'react';
import { IoSend, IoSparkles } from 'react-icons/io5';
import { FiPaperclip } from 'react-icons/fi';
import { BsMicFill } from 'react-icons/bs';
import { HiLightBulb } from 'react-icons/hi';
import { RiChatSmile3Line } from 'react-icons/ri';
import { Input } from '@/components/ui/input';
import { useMessageStore } from '@/lib/store/store';
import { useRouter } from 'next/navigation';
import {init,createId } from "@paralleldrive/cuid2";

const Chat = () => {
  const [message, setMessage] = useState('');
  const{addMessage}=useMessageStore()
  const router=useRouter()

  
  const suggestedPrompts = [
    { icon: <HiLightBulb />, text: "Explain quantum computing" },
    { icon: <IoSparkles />, text: "Write a creative story" },
    { icon: <RiChatSmile3Line />, text: "Tell me a joke" },
  ];

    /* 
  later here i will create a new consersation in datbase and also msg and  save msg to database and get the id of conversation and pass it in router.push 
  with the help of zustand the data will pserserv after router.push after goin to that page i will fetch the conversation and sent messgae to backend call ai agent 
  note: gole is to only create the save the new chat if fist msg is sent and talso url id only add if first msg has been sent 
  */
async function handelSubmit() {
  if(!message) return;
  addMessage({ role: "user", content: message,createdAt:new Date });
 const id = init({}); // generate a unique ID
  router.push(`/chat/${id()}`) // later change it to conversationId; 
  setMessage(''); // clear input
}

  return (
    <div className="h-[calc(100vh-72px)]  bg-gray-900 flex justify-center items-center">
      <div className="max-w-4xl w-full px-6">
        {/* Welcome Section */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-purple-500/20 rounded-full blur-xl"></div>
              <IoSparkles className="text-6xl text-purple-400 relative" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hello! How can I help you today?
          </h1>
          <p className="text-gray-400 text-lg">
            Ask me anything or choose from suggestions below
          </p>
        </div>


        {/* Suggested Prompts */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setMessage(prompt.text)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-full text-gray-300 hover:bg-gray-700/50 hover:border-purple-500/50 hover:text-white transition-all duration-300 group"
            >
              <span className="text-purple-400 group-hover:scale-110 transition-transform">
                {prompt.icon}
              </span>
              {prompt.text}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 blur-xl rounded-full"></div>
          
          <div className="relative flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full px-2 py-1 shadow-2xl hover:border-gray-600 transition-all duration-300 focus-within:border-purple-500">
            {/* Attachment Button */}
            <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
              <FiPaperclip className="text-xl" />
            </button>
            

            {/* Input Field */}
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-2 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none text-lg border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              onKeyDown={(e) => e.key === 'Enter' && message && console.log('Send:', message)}
            />

            {/* Mic Button */}
            <button className="p-3 text-gray-400 hover:text-gray-300 hover:bg-gray-700/50 rounded-full transition-all duration-200">
              <BsMicFill className="text-xl" />
            </button>

            {/* Send Button */}
            <button 
              className={`p-3 rounded-full transition-all duration-300 ${
                message 
                  ? 'bg-linear-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105' 
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!message}
              onClick={handelSubmit}
            >
              <IoSend className="text-xl" />
            </button>
          </div>
        </div>

        {/* Bottom hint */}
        {/* <p className="text-center text-gray-600 text-sm mt-6">
          Press Enter to send • Shift+Enter for new line
        </p> */}
      </div>
    </div>
  );
};

export default Chat;