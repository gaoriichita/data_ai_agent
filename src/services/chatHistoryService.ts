import type { Project } from '../engine/projectEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isBuildProgress?: boolean;
  attachments?: { name: string; size: number }[];
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
  project: Project | null;
}

const STORAGE_KEY = 'appforge_chat_history';

export const getChatHistory = (): ChatSession[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load chat history', e);
    return [];
  }
};

export const saveChatSession = (session: ChatSession) => {
  try {
    const history = getChatHistory();
    const existingIndex = history.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      history[existingIndex] = session;
    } else {
      history.push(session);
    }
    
    // Sort by most recent
    history.sort((a, b) => b.updatedAt - a.updatedAt);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save chat session', e);
  }
};

export const deleteChatSession = (id: string) => {
  try {
    const history = getChatHistory().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to delete chat session', e);
  }
};

export const generateTitle = (firstMessage: string): string => {
  // Take first 30 chars of the first user message
  const text = firstMessage.trim();
  if (text.length > 25) {
    return text.substring(0, 25) + '...';
  }
  return text;
};
