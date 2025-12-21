
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const examples = [
  {
    id: "robot",
    title_zh: "找到朋友的小機器人",
    description_zh: "一個孤獨的機器人在大城市裡與一隻小鳥成為了意想不到的朋友。",
    title_en: "The Little Robot Who Found a Friend",
    description_en: "A lonely robot makes an unexpected friend with a little bird in a big city.",
    imageUrl: "https://picsum.photos/seed/robot/600/400",
    imageHint: "robot bird"
  },
  {
    id: "treehouse",
    title_zh: "魔法樹屋",
    description_zh: "兩個朋友建造了一個可以飛到任何他們想像地方的樹屋。",
    title_en: "The Magic Treehouse",
    description_en: "Two friends build a treehouse that can fly anywhere they imagine.",
    imageUrl: "https://picsum.photos/seed/treehouse/600/400",
    imageHint: "magic treehouse"
  },
  {
    id: "bear",
    title_zh: "脾氣暴躁的熊的驚喜",
    description_zh: "一隻只想睡覺的脾氣暴躁的熊, 從一隻執著的松鼠那裡學會了分享的快樂。",
    title_en: "The Grumpy Bear's Surprise",
    description_en: "A grumpy bear who just wants to sleep learns the joy of sharing from a persistent squirrel.",
    imageUrl: "https://picsum.photos/seed/bear/600/400",
    imageHint: "grumpy bear"
  },
  {
      id: "stars",
      title_zh: "偷星星的女孩",
      description_zh: "一個小女孩想把夜空中的一顆星星當作寵物，卻發現星星屬於每一個人。",
      title_en: "The Girl Who Stole a Star",
      description_en: "A little girl tries to keep a star from the night sky as a pet, only to learn that stars belong to everyone.",
      imageUrl: "https://picsum.photos/seed/stargirl/600/400",
      imageHint: "girl stars"
  },
  {
      id: "socks",
      title_zh: "消失的襪子之謎",
      description_zh: "一隻勇敢的襪子進入烘乾機的神秘世界，去尋找它失蹤的另一半。",
      title_en: "The Mystery of the Missing Sock",
      description_en: "A brave sock journeys into the mysterious world behind the dryer to find its missing partner.",
      imageUrl: "https://picsum.photos/seed/sock/600/400",
      imageHint: "lost sock"
  }
];

export default function ExampleLibraryPage() {
  const { t, language } = useLanguage();

  return (
    <div className="container mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <FileText className="h-10 w-10 text-accent" />
        <h1 className="text-4xl font-headline font-bold">{t('example_library')}</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        {language === 'zh' ? '探索這些故事以獲取靈感。' : 'Explore these stories for inspiration.'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {examples.map((example, index) => (
          <Card key={example.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="aspect-video relative w-full overflow-hidden">
              <Image
                src={example.imageUrl}
                alt={language === 'zh' ? example.title_zh : example.title_en}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={example.imageHint}
                priority={index < 3}
              />
            </div>
            <CardHeader>
              <CardTitle className="font-headline">{language === 'zh' ? example.title_zh : example.title_en}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{language === 'zh' ? example.description_zh : example.description_en}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
