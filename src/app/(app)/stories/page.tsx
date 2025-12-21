
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Loader2, Copy, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Story } from '@/lib/types';


export default function StoriesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const storiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching stories: ", error);
        // Optionally, show a toast notification for the error
      } finally {
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const getSnippet = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  }

  const handleCopyToCollection = async (story: Story) => {
    try {
      const { id, ...storyData } = story;
      await addDoc(collection(db, 'story_collections'), {
        ...storyData,
        copiedAt: serverTimestamp(),
      });
      toast({
        title: t('story_saved_title'),
        description: t('story_saved_description'),
      });
    } catch (error) {
      console.error("Error copying story: ", error);
      toast({
        title: t('save_failed_title'),
        description: t('save_failed_description'),
        variant: "destructive"
      });
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      setStories(stories.filter(s => s.id !== storyId));
      toast({
        title: t('delete_success_title'),
        description: t('delete_success_description'),
      });
    } catch (error) {
      console.error("Error deleting story: ", error);
      toast({
        title: t('delete_failed_title'),
        description: t('delete_failed_description'),
        variant: "destructive"
      });
    }
  };

  // Filter stories based on the current language context
  const filteredStories = stories.filter(story => story.language === language);

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <BookOpen className="h-10 w-10 text-accent" />
        <h1 className="text-4xl font-headline font-bold">{t('my_stories')}</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        {t('stories_description')}
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => {
            // Cycle through placeholder images
            const image = PlaceHolderImages[index % PlaceHolderImages.length];
            return (
              <Card key={story.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  {image && (
                    <div className="aspect-video relative w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        data-ai-hint={image.imageHint}
                        priority={index < 3}
                      />
                    </div>
                  )}
                  <CardTitle className="pt-4 font-headline">{story.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{getSnippet(story.content)}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0 flex flex-col gap-2">
                  <Button asChild className="w-full">
                    <Link href={`/stories/${story.id}`}>{t('read_story')}</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-accent text-accent hover:bg-accent hover:text-white"
                    onClick={() => handleCopyToCollection(story)}
                  >
                    <Copy className="h-4 w-4" />
                    {t('copy_to_collections' as any)}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('delete_story')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('delete_confirm_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('delete_confirm_description')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('close')}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteStory(story.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t('delete_story')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold font-headline mb-2">{t('storybook_empty_title')}</h2>
          <p className="text-muted-foreground mb-4">{t('storybook_empty_description')}</p>
          <Button asChild>
            <Link href="/story-creator">{t('create_your_first_story')}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
