import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Message } from "../types/fileType";
import { createId } from "@paralleldrive/cuid2";

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


type MessageStore = {
  initialMessage: Message | null;
  addMessage: (message: Omit<Message, "id">) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
   initialMessage: null,
  addMessage: (message) =>
    set({
      initialMessage: { id: createId(), ...message }, // auto-generate unique ID
    }),
  clearMessages: () => set({  initialMessage: null }),
}));
