import type { Timestamp } from "firebase/firestore";

export type StoryOutline = {
  characters: string;
  setting: string;
  plot: string;
  moral: string;
};

export type Story = {
  id: string;
  title: string;
  outline: StoryOutline;
  content: string;
  language: 'zh' | 'en';
  createdAt: Timestamp;
};
