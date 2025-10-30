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
  const last = state.messages[state.messages.length - 1];
  return last.tool_calls?.length > 0 ? "tool_node" : END;
}

export const graph = new StateGraph(MessagesAnnotation)
  .addNode("mock_llm", mockLlm)
  .addNode("tool_node", toolNode)
  .addEdge(START, "mock_llm")
  .addEdge("tool_node", "mock_llm")
  .addConditionalEdges("mock_llm", shouldUseTool)
  .compile({ checkpointer });