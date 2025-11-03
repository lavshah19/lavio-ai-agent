import { FileUpload } from "../types/fileType";
import { graph } from "./stateGraph";


export async function mainAgent(userMessage: string, conversationId: string,file: FileUpload[]): Promise<string> {
  const langGraphConfig = { configurable: { thread_id: conversationId } };
  const systemPrompt = "You are a helpful expert called lavio who provides concise answers.";
  const finalUserPrompt = `${userMessage} ${file.length > 0 ?  "imageUrl:" + file[0].storageUrl : ''}`;
  const initialState = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: finalUserPrompt },
    ],
  };

  const lastState = await graph.invoke(initialState, langGraphConfig);
  const lastMsg = lastState.messages.at(-1);

  if (!lastMsg?.content || typeof lastMsg.content !== "string") {
    throw new Error("Invalid AI response"); 
  }

  return lastMsg.content;
}