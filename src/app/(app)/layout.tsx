import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import packageJson from '../../../package.json';


export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen lg:p-8 p-4">
          {children}
        </div>
        <div className="app-version">v{packageJson.version}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
