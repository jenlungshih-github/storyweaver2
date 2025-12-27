"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { expandStoryOutline } from '@/ai/flows/expand-story-outline';
import { saveStory } from '@/lib/actions/story.actions';
import { useLanguage } from '@/context/language-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand, BookUp, Lock, UserPlus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

type FormData = {
  outline: string;
  title: string;
};

export default function StoryExpansionPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { register, handleSubmit, getValues, setValue } = useForm<FormData>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [story, setStory] = useState<{ zh: string; en: string } | null>(null);
  const [titles, setTitles] = useState<{ zh: string; en: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return null;

  if (user?.isAnonymous) {
    return (
      <div className="container mx-auto max-w-4xl py-12">
        <div className="flex items-center gap-4 mb-8">
          <Sparkles className="h-12 w-12 text-slate-800 opacity-50" />
          <h1 className="text-5xl font-headline font-bold text-slate-400">{t('expand_your_story_title')}</h1>
        </div>

        <Card className="border-2 border-dashed bg-blue-50/30 border-blue-100">
          <CardContent className="flex flex-col items-center text-center py-16 gap-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <Lock className="h-10 w-10 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-headline font-bold text-slate-800">{t('guest_expansion_restricted_title')}</h2>
              <p className="text-lg text-slate-600 max-w-md mx-auto">
                {t('guest_expansion_restricted_description')}
              </p>
            </div>
            <div className="flex gap-4">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-white">
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

  const handleExpand = async (data: FormData) => {
    setIsLoading(true);
    setStory(null);
    setTitles(null);
    try {
      const result = await expandStoryOutline({ outline: data.outline });
      if (result.title && result.fullStoryChinese && result.fullStoryEnglish) {
        setStory({ zh: result.fullStoryChinese, en: result.fullStoryEnglish });
        // Assuming the AI returns a single title, we'll use it for both.
        // For separate titles, the AI flow would need to be updated.
        setTitles({ zh: result.title, en: result.title });
        setValue("title", result.title);
      } else {
        toast({
          variant: 'destructive',
          title: t('error_expanding_story_title'),
          description: t('error_expanding_story_description'),
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: t('error_expanding_story_title'),
        description: t('error_expanding_story_generic'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!story || !titles) return;
    const { outline } = getValues();
    const currentTitle = getValues("title");
    if (!currentTitle) {
      toast({
        variant: "destructive",
        title: t('missing_info_title'),
        description: t('story_title_is_required'),
      });
      return;
    }

    // For simplicity, we'll use the current title for both languages.
    const finalTitles = {
      zh: currentTitle,
      en: currentTitle,
    }

    setIsSaving(true);
    try {
      await saveStory({
        title_zh: finalTitles.zh,
        title_en: finalTitles.en,
        outline: { characters: '', setting: '', plot: outline, moral: '' },
        content_zh: story.zh,
        content_en: story.en,
      });
      toast({
        title: t('story_saved_title'),
        description: `"${currentTitle}" ${t('story_saved_description')}`,
      });
    } catch (error) {
      console.error("Save story error:", error);
      toast({
        variant: 'destructive',
        title: t('save_failed_title'),
        description: t('save_failed_description'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="flex items-center gap-4 mb-4">
        <Sparkles className="h-12 w-12 text-slate-800" />
        <h1 className="text-5xl font-headline font-bold text-slate-800">{t('expand_your_story_title')}</h1>
      </div>
      <p className="text-xl text-slate-600 mb-12">{t('expand_your_story_subtitle')}</p>

      <form onSubmit={handleSubmit(handleExpand)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="border-none shadow-xl bg-white min-h-[500px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-headline text-slate-800">{t('your_outline_title')}</CardTitle>
              <CardDescription className="text-lg text-slate-500">{t('your_outline_description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col pt-4">
              <Textarea
                {...register('outline', { required: true })}
                placeholder={t('outline_placeholder_squirrel')}
                className="flex-grow min-h-[300px] text-lg bg-slate-50/50 border-slate-100 focus:border-blue-400 focus:ring-blue-400 p-6 resize-none"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Sparkles className="mr-3 h-6 w-6" />
                )}
                {t('expand_story_button')}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-white min-h-[500px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl font-headline text-slate-800">{t('your_completed_story_title')}</CardTitle>
              <CardDescription className="text-lg text-slate-500">{t('your_completed_story_subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col pt-4">
              {isLoading && (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/50 border-2 border-dashed border-slate-100 h-full min-h-[300px] text-center p-8">
                  <Loader2 className="animate-spin h-16 w-16 text-blue-500 mb-6" />
                  <p className="text-2xl font-headline text-slate-800 mb-2">{t('magic_is_happening')}</p>
                  <p className="text-lg text-slate-500">{t('ai_is_writing')}</p>
                </div>
              )}
              {!isLoading && !story && (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/50 border-2 border-dashed border-slate-100 h-full min-h-[300px] text-center p-8">
                  <Sparkles className="h-16 w-16 text-blue-300 mb-6" />
                  <p className="text-xl text-slate-400 max-w-xs">{t('expanded_story_placeholder_text')}</p>
                </div>
              )}
              {story && (
                <div className='flex flex-col h-full gap-6'>
                  <Input
                    {...register("title", { required: true })}
                    placeholder={t('story_title_placeholder')}
                    className="h-14 text-xl font-bold bg-slate-50/50 border-slate-100 focus:border-blue-400 focus:ring-blue-400 px-6"
                  />
                  <ScrollArea className="flex-grow h-[300px] w-full rounded-2xl border border-slate-100 bg-slate-50/20 p-8 font-body text-lg leading-relaxed text-slate-700">
                    <p className="whitespace-pre-wrap">{story.zh}</p>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving || !story}
                variant="outline"
                className="w-full h-14 text-lg font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <BookUp className="mr-3 h-6 w-6" />
                )}
                {t('save_story')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
