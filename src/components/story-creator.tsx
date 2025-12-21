
"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { generateStoryIdeas } from "@/ai/flows/generate-story-ideas";
import { expandStoryOutline } from "@/ai/flows/expand-story-outline";
import { saveStory } from "@/lib/actions/story.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter as StoryCreatorDialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Wand, BookUp, BrainCircuit, ExternalLink } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { provideStoryFeedback } from "@/ai/flows/provide-story-feedback";


type FormData = {
  themes: string;
  keywords: string;
  characters: string;
  setting: string;
  plot: string;
  moral: string;
  title: string;
  story: string;
};

export default function StoryCreator() {
    const [loadingStates, setLoadingStates] = useState({
    idea: false,
    story: false,
    feedback: false,
    save: false,
    saveFeedback: false,
  });
  const [generatedIdea, setGeneratedIdea] = useState<{ zh: string; en: string } | null>(null);
  const [story, setStory] = useState<{ zh: string; en: string } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const { register, handleSubmit, setValue, control, getValues } = useForm<FormData>({
    defaultValues: {
      themes: "友誼 勇氣",
      keywords: "小辰辰 貓熊",
      characters: "",
      setting: "",
      plot: "",
      moral: "",
      title: "",
      story: ""
    },
  });

  const outlineValues = useWatch({
    control,
    name: ["characters", "setting", "plot", "moral"],
  });
  const isOutlineFilled = outlineValues.every(value => value && value.trim() !== "");

  const anyLoading = Object.values(loadingStates).some(state => state);
  
  const handleError = (error: any, defaultTitle: string, defaultMessage: string) => {
    console.error(error);
    const errorMessage = (error as Error).message || '';
    if (errorMessage.includes('429') || /rate limit|quota/i.test(errorMessage)) {
      toast({
        variant: 'destructive',
        title: t('rate_limit_title'),
        description: t('rate_limit_description'),
      });
    } else {
      toast({
        variant: 'destructive',
        title: defaultTitle,
        description: defaultMessage,
      });
    }
  };

  const handleGenerateIdea = async (data: FormData) => {
    setLoadingStates((prev) => ({ ...prev, idea: true }));
    setGeneratedIdea(null);
    setValue("characters", "");
    setValue("setting", "");
    setValue("plot", "");
    setValue("moral", "");

    try {
      const result = await generateStoryIdeas({
        themes: data.themes,
        keywords: data.keywords,
        language: language,
      });

      if (result.storyIdeaChinese && result.storyIdeaEnglish && result.outline) {
        setGeneratedIdea({ zh: result.storyIdeaChinese, en: result.storyIdeaEnglish });
        
        setValue("characters", result.outline.characters);
        setValue("setting", result.outline.setting);
        setValue("plot", result.outline.plot);
        setValue("moral", result.outline.moral);
        toast({
            title: t('idea_applied_title'),
            description: t('idea_applied_description'),
        });

      } else {
        toast({
          variant: "destructive",
          title: t('error_generating_idea_title'),
          description: t('error_generating_idea_description'),
        });
      }
    } catch (error) {
      handleError(error, t('error_generating_idea_title'), t('error_generating_idea_generic'));
    } finally {
      setLoadingStates((prev) => ({ ...prev, idea: false }));
    }
  };

  const handleExpandStory = async () => {
    setLoadingStates(prev => ({ ...prev, story: true }));
    setStory(null);
    const { characters, setting, plot, moral } = getValues();
    const outline = `Characters: ${characters}\nSetting: ${setting}\nPlot: ${plot}\nMoral: ${moral}`;

    try {
      const result = await expandStoryOutline({ outline });
      if (result.title && result.fullStoryChinese && result.fullStoryEnglish) {
        setStory({ zh: result.fullStoryChinese, en: result.fullStoryEnglish });
        setValue("title", result.title);
        setValue("story", language === 'zh' ? result.fullStoryChinese: result.fullStoryEnglish);
      } else {
         toast({
          variant: "destructive",
          title: t('error_expanding_story_title'),
          description: t('error_expanding_story_description'),
        });
      }
    } catch (error) {
      handleError(error, t('error_expanding_story_title'), t('error_expanding_story_generic'));
    } finally {
      setLoadingStates(prev => ({ ...prev, story: false }));
    }
  };
  
  const handleGetFeedback = async () => {
    if (!story) {
      toast({
        variant: "destructive",
        title: t('no_story_to_review_title'),
        description: t('no_story_to_review_description'),
      });
      return;
    }
    setLoadingStates(prev => ({ ...prev, feedback: true }));
    setIsFeedbackOpen(true);
    setFeedback("");
     try {
      const result = await provideStoryFeedback({ storyDraft: language === 'zh' ? story.zh : story.en });
      if (result.feedback) {
        setFeedback(result.feedback);
      } else {
        setFeedback(t('could_not_get_feedback'));
      }
    } catch (error) {
      handleError(error, t('error_getting_feedback_title'), t('error_getting_feedback_generic'));
    } finally {
      setLoadingStates(prev => ({ ...prev, feedback: false }));
    }
  };

  const handleSaveStory = async () => {
    const { title, characters, setting, plot, moral } = getValues();
    if (!title || !story) {
      toast({
        variant: "destructive",
        title: t('missing_info_title'),
        description: t('missing_info_description'),
      });
      return;
    }
    setLoadingStates(prev => ({...prev, save: true}));
    try {
      // For simplicity, we'll use the generated title for both languages.
      // A more complex implementation could allow separate titles.
      await saveStory({
        title_zh: title,
        title_en: title,
        outline: { characters, setting, plot, moral },
        content_zh: story.zh,
        content_en: story.en,
      });
      toast({
        title: t('story_saved_title'),
        description: `"${title}" ${t('story_saved_description')}`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('save_failed_title'),
        description: t('save_failed_description'),
      });
    } finally {
        setLoadingStates(prev => ({...prev, save: false}));
    }
  };
  
  const handleSaveFeedback = async () => {
    const originalTitle = getValues("title") || "Untitled Story";
    const feedbackTitleZh = `關於「${originalTitle}」的AI回饋`;
    const feedbackTitleEn = `AI Feedback for "${originalTitle}"`;
    
    setLoadingStates(prev => ({ ...prev, saveFeedback: true }));
    try {
      await saveStory({
        title_zh: feedbackTitleZh,
        title_en: feedbackTitleEn,
        outline: { characters: '', setting: '', plot: 'AI Feedback', moral: '' },
        content_zh: feedback, // Save the same feedback content for both languages
        content_en: feedback,
      });
      toast({
        title: t('story_saved_title'),
        description: `"${language === 'zh' ? feedbackTitleZh : feedbackTitleEn}" ${t('story_saved_description')}`,
      });
      setIsFeedbackOpen(false); // Close dialog on successful save
    } catch (error) {
      console.error("Save feedback error:", error);
      toast({
        variant: "destructive",
        title: t('save_failed_title'),
        description: t('save_failed_description'),
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, saveFeedback: false }));
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>{t('story_outline')}</CardTitle>
        <CardDescription>{t('story_plan_description')}</CardDescription>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">{t('step_1_idea')}</h3>
            </AccordionTrigger>
            <AccordionContent>
                <CardDescription className="mb-4">
                  {t('idea_generation_description')}
                </CardDescription>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="themes">{t('themes')}</Label>
                    <Input id="themes" placeholder={t('themes_placeholder')} {...register("themes")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="keywords">{t('keywords')}</Label>
                    <Input id="keywords" placeholder={t('keywords_placeholder')} {...register("keywords")} />
                  </div>
                </div>
                <Button onClick={handleSubmit(handleGenerateIdea)} disabled={anyLoading} className="mt-6 w-full">
                  {loadingStates.idea ? <Loader2 className="animate-spin" /> : <Sparkles className="mr-2" />}
                  {t('generate_idea')}
                </Button>
              {generatedIdea && (
                <div className="mt-6 p-4 border-l-4 border-accent bg-yellow-50 rounded-r-lg">
                  <h4 className="font-bold font-headline mb-2">{t('generated_idea')}</h4>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {language === 'zh' ? generatedIdea.zh : generatedIdea.en}
                  </p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h3 className="text-lg font-semibold">{t('step_2_outline')}</h3>
            </AccordionTrigger>
            <AccordionContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="characters">{t('character_name')}</Label>
                    <Input id="characters" placeholder={t('character_name_placeholder')} {...register("characters")} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="setting">{t('story_setting')}</Label>
                    <Input id="setting" placeholder={t('story_setting_placeholder')} {...register("setting")} />
                  </div>
                </div>
                 <div className="grid gap-4 mt-4">
                   <div className="grid gap-2">
                      <Label htmlFor="plot">{t('problem_goal')}</Label>
                      <Textarea id="plot" placeholder={t('problem_goal_placeholder')} {...register("plot")} className="h-20" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="moral">{t('ending')}</Label>
                      <Textarea id="moral" placeholder={t('ending_placeholder')} {...register("moral")} className="h-20" />
                    </div>
                </div>
                 <Button onClick={handleExpandStory} disabled={!isOutlineFilled || anyLoading} className="mt-4 w-full">
                   {loadingStates.story ? <Loader2 className="animate-spin" /> : <Wand className="mr-2" />}
                   {t('expand_with_ai')}
                 </Button>
            </AccordionContent>
          </AccordionItem>

           <AccordionItem value="item-3">
            <AccordionTrigger>
               <h3 className="text-lg font-semibold">{t('step_3_expand')}</h3>
            </AccordionTrigger>
            <AccordionContent>
               <CardDescription className="mb-4">
                 {t('story_tab_description')}
              </CardDescription>
               <div className="grid gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="title">{t('story_title')}</Label>
                    <Input id="title" placeholder={t('story_title_placeholder')} {...register("title")} />
                  </div>

                 {loadingStates.story && (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center mt-4">
                      <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
                      <p className="font-headline">{t('magic_is_happening')}</p>
                      <p className="text-muted-foreground text-sm">{t('ai_is_writing')}</p>
                    </div>
                  )}
                 {story && (
                    <div className="grid gap-2 mt-4">
                      <Label htmlFor="story-content">{language === 'zh' ? t('your_story_zh') : 'Your Story (English)'}</Label>
                      <ScrollArea className="h-64 w-full rounded-md border p-4 font-body">
                        <p className="whitespace-pre-wrap">{language === 'zh' ? story.zh : story.en}</p>
                      </ScrollArea>
                    </div>
                  )}
               </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>

      {story && (
          <CardFooter className="flex-col sm:flex-row gap-2 pt-4 border-t mt-4">
               <Button onClick={handleGetFeedback} variant="outline" disabled={anyLoading}>
                  {loadingStates.feedback ? <Loader2 className="animate-spin" /> : <BrainCircuit className="mr-2" />}
                  {t('get_feedback')}
              </Button>
              <Button onClick={handleSaveStory} disabled={anyLoading}>
                  {loadingStates.save ? <Loader2 className="animate-spin" /> : <BookUp className="mr-2" />}
                  {t('save_story')}
              </Button>
               <Button asChild variant="secondary">
                   <a href="https://gemini.google.com/" target="_blank" rel="noopener noreferrer">
                       <Sparkles className="mr-2" /> {t('generate_illustrations')} <ExternalLink className="ml-2" />
                   </a>
               </Button>
          </CardFooter>
      )}
      
       <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">{t('feedback_dialog_title')}</DialogTitle>
            <DialogDescription>
              {t('feedback_dialog_description')}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-72 w-full rounded-md border p-4 my-4">
            {loadingStates.feedback ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm">{feedback}</p>
            )}
          </ScrollArea>
           <StoryCreatorDialogFooter>
              <Button type="button" onClick={handleSaveFeedback} disabled={loadingStates.saveFeedback || loadingStates.feedback || !feedback}>
                {loadingStates.saveFeedback ? <Loader2 className="animate-spin" /> : <BookUp className="mr-2" />}
                {t('save_feedback')}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="secondary">{t('close')}</Button>
              </DialogClose>
           </StoryCreatorDialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
