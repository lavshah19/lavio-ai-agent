import { ChatGroq } from "@langchain/groq";
import { TavilySearch } from "@langchain/tavily";
import { describeImageTool } from "./tools/imageTool";

const SearchEnginetool = new TavilySearch({
  maxResults: 3,
  topic: "general",
  tavilyApiKey: process.env.TAVILY_API_KEY,
  description:"Useful for answering general questions by searching the web for relevant information. this tools is not for image description or analysis.",
});
export const tools = [SearchEnginetool,describeImageTool];

export const baseModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

// Bound (“Runnable”) model for AI agent logic
export const model = baseModel.bindTools(tools);