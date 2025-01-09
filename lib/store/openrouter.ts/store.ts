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
    const response = await fetch("/api/chats");
    const chats = await response.json();
    console.log("chats", chats);
    set({ chats: chats.data });
  },
  setChats: (question: any, originalAnswer: any, model: string, intent: string) => {
    const answer = originalAnswer[0].content;
    const newChat = { question, answer, model, intent };
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