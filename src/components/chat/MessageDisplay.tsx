import React from 'react'
import Thinking from './Thinking'
import { IoSparkles } from 'react-icons/io5'
import Markdown from 'react-markdown'
import { Message } from '@/lib/types/fileType'
import { AiOutlineFilePdf } from 'react-icons/ai'

const MessageDisplay = ({ messages,isThinking,bottomRef }: { messages: Message[],isThinking: boolean,bottomRef: React.RefObject<HTMLDivElement | null> }) => {
  return (
       <div className="max-w-4xl mx-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.role === "user" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-linear-to-r from-blue-500 to-purple-500 text-white"
                          : "bg-gray-800 text-gray-100 border border-gray-700"
                      }`}
                    >
                      {msg.role === "ai" && (
                        <div className="flex items-center gap-2 mb-2">
                          <IoSparkles className="text-purple-400" />
                          <span className="text-sm font-semibold text-purple-400">
                            Lavio
                          </span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap wrap-break-word hide-scrollbar overflow-x-auto prose prose-invert max-w-none">
                        <Markdown>{msg.content}</Markdown>
                      </div>
    
                      {/* ✅ New Section: show attached images */}
                      {msg.attachedFiles?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.attachedFiles.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="relative group w-32 h-32 overflow-hidden rounded-lg border border-gray-700 hover:border-purple-500 transition-all"
                            >
                              {!attachment.file.fileType.includes("pdf") ? (
                                <img
                                  src={attachment.file.storageUrl}
                                  alt={attachment.file.fileName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400 bg-gray-900">
                                  <AiOutlineFilePdf className="text-red-400 text-2xl" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
    
              {isThinking && <Thinking />}
              {/*  Invisible div to scroll into view */}
              <div ref={bottomRef}></div>
            </div>
  )
}

export default MessageDisplay