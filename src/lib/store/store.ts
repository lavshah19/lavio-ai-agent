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
  id: number;
  sender: "user" | "ai";
  text: string;
  time: string;
};

type MessageStore = {
  messages: Message[];
  addMessage: (message: Omit<Message, "id">) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  addMessage: (message) =>
    set({
      messages: [
        ...get().messages,
        { id: Date.now(), ...message }, // auto-generate unique ID
      ],
    }),
  clearMessages: () => set({ messages: [] }),
}));
