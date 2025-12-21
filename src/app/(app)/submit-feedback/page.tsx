"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send, MessageSquare } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const formSchema = z.object({
  email: z.string().email(),
  story: z.string().min(10, { message: "Story must be at least 10 characters." }),
});

export default function SubmitFeedbackPage() {
    const { t } = useLanguage();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            story: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Feedback submitted:", values);
        toast({
            title: t('feedback_submitted_title'),
            description: t('feedback_submitted_description'),
        });
        form.reset();
    }
  return (
    <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
            <MessageSquare className="h-10 w-10 text-accent" />
            <h1 className="text-4xl font-headline font-bold">{t('submit_feedback_page_title')}</h1>
        </div>
        <p className="text-muted-foreground mb-8">
            {t('submit_feedback_page_subtitle')}
        </p>

        <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>{t('share_your_work_title')}</CardTitle>
                <CardDescription>
                    {t('share_your_work_description')}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('your_email')}</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="story"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('your_story_outline')}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder={t('once_upon_a_time')} {...field} className="h-40" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit">
                           <Send className="mr-2" /> {t('submit_feedback_button')}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
