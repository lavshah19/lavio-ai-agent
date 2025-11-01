import React, { JSX } from 'react'
type SuggestedPrompt = {
 
  suggestedPrompts:{
    icon: JSX.Element;   
  text: string;
  }[],
  setMessage:React.Dispatch<React.SetStateAction<string>>
};
const SuggestedPrompts = ({suggestedPrompts,setMessage}:SuggestedPrompt) => {
  return (
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
  )
}

export default SuggestedPrompts