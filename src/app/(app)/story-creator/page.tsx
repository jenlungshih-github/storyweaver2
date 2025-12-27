"use client";

import { useEffect, useState } from 'react';
import StoryCreator from "@/components/story-creator";
import { useLanguage } from "@/context/language-context";
import { BookMarkedIcon, Lock, UserPlus } from "lucide-react";
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function NewStoryPage() {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (!user || user.isAnonymous) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="flex items-center gap-4 mb-8">
          <BookMarkedIcon className="h-10 w-10 text-accent opacity-50" />
          <h1 className="text-4xl font-headline font-bold text-muted-foreground">{t('create_your_story')}</h1>
        </div>

        <Card className="border-2 border-dashed bg-accent/5 border-accent/20">
          <CardContent className="flex flex-col items-center text-center py-16 gap-6">
            <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
              <Lock className="h-10 w-10 text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold">{t('guest_restricted_title')}</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {t('guest_restricted_description')}
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
      </div>
    );
  }

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
