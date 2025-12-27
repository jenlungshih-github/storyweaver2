
"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Library, Loader2, BookOpen, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Sparkles, UserPlus } from "lucide-react";
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

export default function StoryCollectionsPage() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchCollections = async () => {
            setIsLoading(true);
            try {
                // Try with orderBy first
                let q = query(collection(db, 'story_collections'), orderBy('copiedAt', 'desc'));
                let querySnapshot = await getDocs(q);

                // If empty or failing, try without orderBy to see if documents exist without the field
                if (querySnapshot.empty) {
                    q = query(collection(db, 'story_collections'));
                    querySnapshot = await getDocs(q);
                }

                const storiesData = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Story));
                setStories(storiesData);
            } catch (error) {
                console.error("Error fetching collections: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCollections();
    }, []);

    const getSnippet = (content: string) => {
        return content.length > 150 ? content.substring(0, 150) + '...' : content;
    }

    const handleDeleteStory = async (storyId: string) => {
        try {
            await deleteDoc(doc(db, 'story_collections', storyId));
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

    const filteredStories = stories.filter(story => story.language === language);

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center gap-4 mb-8">
                <Library className="h-10 w-10 text-accent" />
                <h1 className="text-4xl font-headline font-bold">{t('story_collections' as any)}</h1>
            </div>
            <p className="text-muted-foreground mb-8 text-lg">
                {t('stories_description')}
            </p>

            {user?.isAnonymous && (
                <Card className="mb-12 border-accent/30 bg-accent/5 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="h-32 w-32 text-accent" />
                    </div>
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl font-headline text-accent flex items-center gap-2">
                            <Sparkles className="h-6 w-6" />
                            {t('guest_welcome_title')}
                        </CardTitle>
                        <CardDescription className="text-lg text-slate-700 max-w-2xl">
                            {t('guest_welcome_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative z-10 pb-6">
                        <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-6 rounded-full shadow-lg transform transition active:scale-95 text-lg">
                            <Link href="/">
                                <UserPlus className="mr-2 h-5 w-5" />
                                {t('sign_in')}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStories.map((story, index) => {
                        const placeholder = PlaceHolderImages[index % PlaceHolderImages.length];
                        const displayImage = story.imageUrl || placeholder.imageUrl;

                        return (
                            <Card key={story.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/50 backdrop-blur-sm border-accent/20">
                                <CardHeader className="p-0">
                                    <div className="aspect-[4/3] relative w-full overflow-hidden">
                                        <Image
                                            src={displayImage}
                                            alt={story.title}
                                            fill
                                            className="object-cover"
                                            priority={index < 3}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <CardTitle className="absolute bottom-4 left-4 right-4 text-white font-headline line-clamp-1">
                                            {story.title}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow p-6">
                                    <CardDescription className="text-gray-700 line-clamp-3">
                                        {getSnippet(story.content)}
                                    </CardDescription>
                                </CardContent>
                                <div className="p-6 pt-0 flex flex-col gap-2">
                                    <Button asChild className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-2 rounded-full shadow-md transform transition active:scale-95">
                                        <Link href={`/stories/${story.id}`}>
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            {t('read_story')}
                                        </Link>
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
                <div className="text-center py-16 border-2 border-dashed border-accent/30 rounded-2xl bg-accent/5">
                    <h2 className="text-2xl font-semibold font-headline mb-2 text-accent">{t('storybook_empty_title')}</h2>
                    <p className="text-muted-foreground mb-6">{t('storybook_empty_description')}</p>
                    <Button asChild className="bg-primary text-white font-bold px-8 py-3 rounded-full hover:shadow-lg transition">
                        <Link href="/stories">{t('my_stories')}</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
