"use server";

import type { StoryOutline } from "@/lib/types";
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface SaveStoryParams {
  title_zh: string;
  title_en: string;
  content_zh: string;
  content_en: string;
  outline: StoryOutline;
}

export async function saveStory(params: SaveStoryParams) {
  const { title_zh, title_en, content_zh, content_en, outline } = params;

  if (!title_zh || !title_en || !content_zh || !content_en) {
      throw new Error("Title and content for both languages are required to save a story.");
  }
  
  try {
    // Save Chinese version
    const zhDocRef = await addDoc(collection(db, "stories"), {
      title: title_zh,
      outline,
      content: content_zh,
      language: 'zh',
      createdAt: serverTimestamp(),
    });

    // Save English version
    const enDocRef = await addDoc(collection(db, "stories"), {
      title: title_en,
      outline,
      content: content_en,
      language: 'en',
      createdAt: serverTimestamp(),
    });

    console.log("Chinese story written with ID: ", zhDocRef.id);
    console.log("English story written with ID: ", enDocRef.id);

    return { success: true, zhId: zhDocRef.id, enId: enDocRef.id };
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to save story to database.");
  }
}
