import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Store = {
  isOpen: boolean;
  setIsOpen: () => void;
};

export const useIsopen = create<Store>()(
  persist(
    (set) => ({
      isOpen: true,
      setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "isOpen-storage", // key name in localStorage
      //  storage: createJSONStorage(() => localStorage), // use sessionStorage if needed
    }
  )
);

type FileUpload = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number | null;
  storageUrl: string;
  embeddingId?: string | null;
  
};

type FileAttachment = {
  id: string;
  messageId: string;
  fileId: string;
  file: FileUpload;
};

type Message = {
  id: string;
  role: "user" | "ai" | "system";
  content: string | null ;
  attachedFiles: FileAttachment[]; // added relation
};

type MessageStore = {
  initialMessage: Message | null;
  addMessage: (message: Omit<Message, "id">) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
   initialMessage: null,
  addMessage: (message) =>
    set({
      initialMessage: { id: Date.now().toLocaleString(), ...message }, // auto-generate unique ID
    }),
  clearMessages: () => set({  initialMessage: null }),
}));
