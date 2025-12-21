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
        <div className="container mx-auto max-w-4xl py-8">
            <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="h-12 w-12 text-yellow-500 fill-current opacity-80" />
                <h1 className="text-5xl font-headline font-bold text-slate-800">{t('submit_feedback_page_title')}</h1>
            </div>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl">
                {t('submit_feedback_page_subtitle')}
            </p>

            <Card className="max-w-3xl border-none shadow-xl bg-white/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-headline text-slate-800">{t('share_your_work_title')}</CardTitle>
                    <CardDescription className="text-lg text-slate-500">
                        {t('share_your_work_description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg font-medium text-slate-700">{t('your_email')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="you@example.com"
                                                {...field}
                                                className="h-14 text-lg bg-yellow-50/50 border-yellow-100 focus:border-yellow-400 focus:ring-yellow-400"
                                            />
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
                                        <FormLabel className="text-lg font-medium text-slate-700">{t('your_story_outline')}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={t('once_upon_a_time')}
                                                {...field}
                                                className="min-h-[300px] text-lg bg-yellow-50/50 border-yellow-100 focus:border-yellow-400 focus:ring-yellow-400 resize-none px-6 py-4"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" size="lg" className="h-14 px-8 text-lg font-bold bg-yellow-400 hover:bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-200 transition-all hover:scale-105 active:scale-95 border-none">
                                <Send className="mr-3 h-6 w-6" /> {t('submit_feedback_button')}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
