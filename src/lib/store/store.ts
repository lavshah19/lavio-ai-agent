import { create } from "zustand";

type Store = {
  isOpen: boolean;
  setIsOpen: () => void;
};

export const useIsopen = create<Store>()((set) => ({
  isOpen: true,
  setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  
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
