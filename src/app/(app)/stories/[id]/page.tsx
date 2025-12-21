
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Story } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function StoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchStory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storyDoc = await getDoc(doc(db, 'stories', id as string));
        if (storyDoc.exists()) {
          setStory({ id: storyDoc.id, ...storyDoc.data() } as Story);
        } else {
          setError("Story not found.");
        }
      } catch (err) {
        console.error("Error fetching story:", err);
        setError("Failed to fetch the story.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error</h2>
        <p>{error}</p>
        <Button onClick={() => router.push('/stories')} className="mt-4">
            <ArrowLeft className="mr-2" /> Back to Stories
        </Button>
      </div>
    );
  }

  if (!story) {
    return null; 
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Button onClick={() => router.push('/stories')} variant="ghost" className="mb-8">
        <ArrowLeft className="mr-2" /> {t('saved_stories')}
      </Button>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-4xl font-headline font-bold text-center">{story.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose lg:prose-xl max-w-none mx-auto font-body text-lg leading-relaxed">
            <p className="whitespace-pre-wrap">{story.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
