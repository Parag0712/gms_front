import React, { useEffect, useState } from "react";
import { ChevronLeft, Menu, X } from "lucide-react";
import { Layout } from "./custom/layout";
import { Button } from "./custom/button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SideLink, getNavigationLinks } from "@/constants/sidelinks";
import { useProjectById } from "@/hooks/management/manage-project";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProjectData {
  data: {
    is_wing: boolean;
    [key: string]: string | number | boolean;
  };
}

function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);
  const pathname = usePathname();

  const isProjectPage = pathname.includes('/manage-project/');
  const projectId = isProjectPage ? Number(pathname.split('/')[2]) : null;

  // Fetch project data using the hook
  const { data: projectData } = useProjectById(projectId as number) as { data: ProjectData | undefined, isLoading: boolean }

  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  // Filter out "Manage Wing" link if is_wing is false
  const getFilteredProjectLinks = (projectId: string): SideLink[] => {
    const links = getNavigationLinks(true, projectId);
    if (!projectData?.data?.is_wing) {
      return links.filter(link => link.title !== "Manage Wing");
    }
    return links;
  };

  // Get navigation links based on project context
  const navigationLinks = isProjectPage && projectId
    ? getFilteredProjectLinks(projectId.toString())
    : getNavigationLinks(false, null);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? "md:w-14" : "md:w-64"
        }`,
        className
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? "h-svh opacity-50" : "h-0 opacity-0"
          } w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? "h-svh" : ""}>
        <Layout.Header
          sticky
          className="z-50 flex items-center justify-between px-4 py-3 shadow-sm md:px-4"
        >
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logo.png"
                alt="9 Sign Logo"
                width={50}
                height={50}
                className="w-6 h-6 max-h-8"
              />
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <X /> : <Menu />}
          </Button>
        </Layout.Header>

        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"
            }`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={navigationLinks}
        />

        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 bottom-4 z-50 hidden rounded-full md:inline-flex"
        >
          <ChevronLeft
            className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </Layout>
    </aside>
  );
}

export default Sidebar;