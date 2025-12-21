"use client";

import { useState } from 'react';
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
import { Loader2, Sparkles, Wand, BookUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

type FormData = {
  outline: string;
  title: string;
};

export default function StoryExpansionPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { register, handleSubmit, getValues, setValue } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [story, setStory] = useState<{ zh: string; en: string } | null>(null);
  const [titles, setTitles] = useState<{ zh: string; en: string } | null>(null);

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
    <div className="container mx-auto max-w-7xl">
       <div className="flex items-center gap-4 mb-8">
        <Sparkles className="h-10 w-10 text-accent" />
        <h1 className="text-4xl font-headline font-bold">{t('expand_your_story')}</h1>
       </div>
       <p className="text-muted-foreground mb-8">{t('expand_story_description')}</p>

      <form onSubmit={handleSubmit(handleExpand)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('your_outline')}</CardTitle>
              <CardDescription>{t('paste_your_outline')}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('outline', { required: true })}
                placeholder={t('outline_placeholder')}
                className="h-60 text-base"
              />
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wand className="mr-2" />
                )}
                {t('expand_story')}
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg flex flex-col">
            <CardHeader>
              <CardTitle>{t('your_completed_story')}</CardTitle>
              <CardDescription>{t('your_completed_story_description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {isLoading && (
                 <div className="flex flex-col items-center justify-center rounded-lg border border-dashed h-80 text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                    <p className="font-headline">{t('magic_is_happening')}</p>
                    <p className="text-muted-foreground text-sm">{t('ai_is_writing')}</p>
                  </div>
              )}
              {!isLoading && !story && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed h-80 text-center p-4">
                   <Wand className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('expanded_story_placeholder')}</p>
                </div>
              )}
              {story && (
                <div className='grid gap-4'>
                    <Input 
                        {...register("title", {required: true})}
                        placeholder={t('story_title_placeholder')}
                    />
                    <ScrollArea className="h-72 w-full rounded-md border p-4 font-body text-base">
                        <p className="whitespace-pre-wrap">{story.zh}</p>
                    </ScrollArea>
                </div>
              )}
            </CardContent>
             <CardFooter>
                 <Button onClick={handleSave} disabled={isSaving || !story}>
                    {isSaving ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <BookUp className="mr-2" />
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
