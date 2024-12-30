import create from "zustand";

const initialState = {
  chats: [],
  currentMessage: undefined,
};

interface OpenRouterStoreState {
  chats: any[];
  currentMessage: any;
  setChats: (questions:any, answers: any) => void;
  updateCurrentMessage: (message: any) => void;
  removeLastMessage: () => void;
}

export const useOpenRouterStore = create<OpenRouterStoreState>((set, get) => ({
  ...initialState,

  setChats: (questions:any, answers: any) => {
    // make a new chat object with key value pairs of questions and answers and push it to chats
    const newChat = { questions, answers };
    const { chats } = get();
    const newChats = [...chats, newChat];
    console.log("newChats", newChats);
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