
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Loader2, Copy, Trash2, Lock, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
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


import { ImageReplace } from "@/components/image-replace";

export default function StoriesPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const storiesData = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Story));
        setStories(storiesData);
      } catch (error) {
        console.error("Error fetching stories: ", error);
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

  const handleImageSuccess = (storyId: string, url: string) => {
    setStories(prev => prev.map(s => s.id === storyId ? { ...s, imageUrl: url } : s));
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

      {(!user || user.isAnonymous) ? (
        <Card className="border-2 border-dashed bg-accent/5 border-accent/20">
          <CardContent className="flex flex-col items-center text-center py-16 gap-6">
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Lock className="h-10 w-10 text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold">{t('guest_library_restricted_title')}</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {t('guest_library_restricted_description')}
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild className="bg-accent hover:bg-accent/90 px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                <Link href="/">
                  <UserPlus className="mr-2 h-5 w-5" />
                  {t('sign_in')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => {
            // Cycle through placeholder images if no custom image
            const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
            const displayImage = story.imageUrl || placeholder.imageUrl;

            return (
              <Card key={story.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <ImageReplace
                    storyId={story.id}
                    currentImageUrl={story.imageUrl}
                    onSuccess={(url) => handleImageSuccess(story.id, url)}
                    className="aspect-[4/3] w-full"
                  >
                    <Image
                      src={displayImage}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority={index < 3}
                    />
                  </ImageReplace>
                  <CardTitle className="px-6 pt-4 font-headline">{story.title}</CardTitle>
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
