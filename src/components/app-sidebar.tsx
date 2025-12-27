
"use client";

import { MagicBookIcon } from "@/components/icons";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  FileText,
  Archive,
  PenTool,
  MessageSquare,
  Bot,
  Home,
  BookMarked,
  ExternalLink,
  LogIn,
  User,
  CheckCircle2,
  LogOut,
  Library,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AuthDialog } from "@/components/auth-dialog";
import { FirebaseStatus } from "@/components/firebase-status";
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!mounted) {
    return (
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <MagicBookIcon className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="font-headline text-lg font-bold tracking-tight">
                {t('app_title')}
              </h2>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4">Loading...</div>
        </SidebarContent>
      </Sidebar>
    )
  }

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      toast({
        title: "Guest Login Successful",
        description: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>You are now exploring as a Guest.</span>
          </div>
        ),
      });
    } catch (error: any) {
      console.error("Guest login failed:", error);
      toast({
        title: "Error",
        description: "Failed to login as guest: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const menuItems = [
    {
      href: "/story-creator",
      icon: BookMarked,
      labelKey: 'create_your_story',
      requiresAuth: true,
    },
    {
      href: "/story-expansion",
      icon: Sparkles,
      labelKey: 'story_expansion',
      requiresAuth: true,
    },
    {
      href: "/stories",
      icon: Archive,
      labelKey: 'saved_stories',
      requiresAuth: true,
    },
    {
      href: "/story-collections",
      icon: Library,
      labelKey: 'story_collections',
    },
    {
      href: "/example-library",
      icon: FileText,
      labelKey: 'example_library',
    },
    {
      href: "/writing-skills",
      icon: PenTool,
      labelKey: 'writing_techniques',
    },
    {
      href: "/submit-feedback",
      icon: MessageSquare,
      labelKey: 'submit_feedback',
    },
    {
      href: "https://gemini.google.com/",
      icon: Bot,
      labelKey: 'open_gemini_ai',
      external: true,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <MagicBookIcon className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="font-headline text-lg font-bold tracking-tight">
              {t('app_title')}
            </h2>
          </div>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>

      <SidebarMenu>
        {menuItems.map((item) => {
          const isRestricted = item.requiresAuth && user?.isAnonymous;
          return (
            <SidebarMenuItem key={item.labelKey}>
              <SidebarMenuButton
                asChild
                isActive={!item.external && pathname === item.href}
                tooltip={t(item.labelKey as any)}
                className={isRestricted ? "opacity-60" : ""}
              >
                <Link href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? "noopener noreferrer" : undefined}>
                  <item.icon className={isRestricted ? "text-muted-foreground" : ""} />
                  <span className={isRestricted ? "text-muted-foreground" : ""}>{t(item.labelKey as any)}</span>
                  {isRestricted && <Lock className="ml-auto h-3 w-3 text-accent" />}
                  {item.external && <ExternalLink className="ml-auto" />}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>

      <SidebarFooter className="mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <LanguageSwitcher />
          </SidebarMenuItem>
          {!user && (
            <>
              <SidebarMenuItem>
                <AuthDialog />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleGuestLogin}
                  disabled={loading}
                  tooltip="Guest Login"
                >
                  <User className="h-4 w-4" />
                  <span>{loading ? "Logging in..." : "Guest Login"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
          {user && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={user.isAnonymous ? "Logged in as Guest" : `Logged in as ${user.displayName || user.email}`}>
                  <Link href="/" target="_blank" rel="noopener noreferrer">
                    <User />
                    <span>{user.isAnonymous ? "Guest User" : (user.displayName || user.email || "User")}</span>
                    <ExternalLink className="ml-auto" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
        <div className="px-4 pb-4">
          <FirebaseStatus />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
