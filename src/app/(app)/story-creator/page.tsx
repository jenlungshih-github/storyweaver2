"use client";

import StoryCreator from "@/components/story-creator";
import { useLanguage } from "@/context/language-context";
import { BookMarkedIcon } from "lucide-react";

export default function NewStoryPage() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <BookMarkedIcon className="h-10 w-10 text-accent" />
        <h1 className="text-4xl font-headline font-bold">{t('create_your_story')}</h1>
      </div>
       <p className="text-muted-foreground mb-4">{t('fill_in_the_blanks')}</p>
      <StoryCreator />
    </div>
  );
}
