"use client";

import Sidebar from "@/components/sidebar/sidebar";
import useIsCollapsed from "@/components/sidebar/use-is-collapsed";
import { usePathname } from "next/navigation";
import ManageProjectDashboard from "./(managment)/manage-project/[id]/dashboard/_components/manage-project-dashboard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  const pathname = usePathname();
  const isProjectPage = pathname.includes("/manage-project");
  return (
    <div className="relative h-full overflow-hidden bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? "md:ml-14" : "md:ml-64"
        } h-full`}
      >
        {isProjectPage && (
          <ManageProjectDashboard />
        )}
        {children}
      </main>
    </div>
  );
}
