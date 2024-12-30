import create from "zustand";

const initialState = {
  messages: [],
  currentMessage: undefined,
};

interface OpenRouterStoreState {
  messages: any[];
  currentMessage: any;
  setMessages: (messages: any) => void;
  updateCurrentMessage: (message: any) => void;
  removeLastMessage: () => void;
}

export const useOpenRouterStore = create<OpenRouterStoreState>((set, get) => ({
  ...initialState,

  setMessages: (messages: any) => {
    set({ messages });
  },

  updateCurrentMessage: (message: any) => {
    const { currentMessage } = get();
    if (currentMessage) {
      const newMessage = { ...currentMessage, ...message };
      set({ currentMessage: newMessage });
    }
  },

  removeLastMessage: () => {
    const { messages } = get();
    const newMessages = messages.slice(0, -1);
    set({ messages: newMessages });
  },
}));