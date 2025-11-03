import React from 'react'
import { IoSparkles } from 'react-icons/io5'

const Thinking = () => {
  return (
     <div className="flex justify-start">
            <div className="max-w-[70%] order-1">
              <div
                className={`px-4 py-3 rounded-2xl bg-gray-800 text-gray-100 border border-gray-700`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <IoSparkles className="text-purple-400" />
                  <span className="text-sm font-semibold text-purple-400">
                    Lavio
                  </span>
                </div>
                {/* Animated ellipsis */}
                <div className="flex items-center space-x-1">
                    <span className="text-gray-300">Thinking</span>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default Thinking