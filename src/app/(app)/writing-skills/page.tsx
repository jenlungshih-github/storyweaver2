"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PenTool } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { ClientOnly } from "@/components/client-only";

export default function WritingSkillsPage() {
  const { t } = useLanguage();

  const skills = [
    {
      id: "concise",
      title: t('skill_concise_title'),
      content: t('skill_concise_content')
    },
    {
      id: "sounds",
      title: t('skill_sounds_title'),
      content: t('skill_sounds_content')
    },
    {
      id: "surprises",
      title: t('skill_surprises_title'),
      content: t('skill_surprises_content')
    },
    {
      id: "repetition",
      title: t('skill_repetition_title'),
      content: t('skill_repetition_content')
    },
    {
      id: "show_dont_tell",
      title: t('skill_show_dont_tell_title'),
      content: t('skill_show_dont_tell_content')
    }
  ];

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <PenTool className="h-10 w-10 text-accent" />
        <h1 className="text-4xl font-headline font-bold">{t('improve_writing_skills')}</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        {t('improve_writing_skills_description')}
      </p>

      <ClientOnly>
        <Accordion type="single" collapsible className="w-full">
          {skills.map(skill => (
            <AccordionItem value={skill.id} key={skill.id}>
              <AccordionTrigger className="text-xl font-headline hover:no-underline">
                {skill.title}
              </AccordionTrigger>
              <AccordionContent className="prose prose-lg max-w-none text-base">
                <p className="whitespace-pre-wrap">{skill.content}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ClientOnly>
    </div>
  );
}
