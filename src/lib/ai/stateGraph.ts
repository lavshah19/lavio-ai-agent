import {
  MessagesAnnotation,
  StateGraph,
  START,
  END,
  MemorySaver,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { model, tools } from "./model";

const checkpointer = new MemorySaver();
const toolNode = new ToolNode(tools);

async function mockLlm(state: any) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

function shouldUseTool(state: any) {
    const lastMessage = state.messages[state.messages.length - 1];

  // Only go to tool_node if the last message actually HAS tool calls
  // and it’s from the model, not the tool’s own output.
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tool_node";
  }

  // Otherwise, finish gracefully.
  return END;
}

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("mock_llm", mockLlm)
  .addNode("tool_node", toolNode)
  .addEdge(START, "mock_llm")
  .addEdge("tool_node", "mock_llm")
  .addConditionalEdges("mock_llm", shouldUseTool)
  .compile({ checkpointer });