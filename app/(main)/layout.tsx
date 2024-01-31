import { Nav } from "@/components/Nav";
import { SidebarTabs } from "@/components/SidebarTabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MainLayoutProbs {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProbs) => {
  return (
    <>
      <Nav />
      <main className="container py-6">{children}</main>
    </>
  );
};

export default MainLayout;
