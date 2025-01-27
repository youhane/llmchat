import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import create from "zustand";

const initialState = {
  chats: [],
  currentMessage: undefined,
};

interface OpenRouterStoreState {
  chats: any[];
  currentMessage: any;
  setChats: (questions: any, answers: any, model: string, intent: string) => void;
  updateCurrentMessage: (message: any) => void;
  removeLastMessage: () => void;
  init: () => Promise<void>;
}

export const useOpenRouterStore = create<OpenRouterStoreState>((set, get) => ({
  ...initialState,
  init: async () => {
    const session = await getSession()
    if(!session?.user?.email){
      // alert("Please login to view chats")
      toast.error("Please login to view chats")
    }

    const response = await fetch("/api/chats", {
      headers: {
        "Authorization": `email ${session?.user?.email}` // Send email in header
      }
    });

    const chats = await response.json();
    console.log("chats", chats);
    set({ chats: chats.data });
  },
  setChats: async (question: any, originalAnswer: any, model: string, intent: string) => {
    const session = await getSession()
    const answer = originalAnswer[0].content;
    const newChat = { question, answer, model, intent, userEmail: session?.user?.email };
    const { chats } = get();
    const newChats = [...chats, newChat];
    fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newChat),
    });
    set({ chats: newChats });
  },

  updateCurrentMessage: (message: any) => {
    const { currentMessage } = get();
    if (currentMessage) {
      const newMessage = { ...currentMessage, ...message };
      set({ currentMessage: newMessage });
    }
  },

  removeLastMessage: () => {
    const { chats } = get();
    const newMessages = chats.slice(0, -1);
    set({ chats: newMessages });
  },
}));