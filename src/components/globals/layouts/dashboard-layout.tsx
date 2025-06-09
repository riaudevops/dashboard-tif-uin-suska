import { AppSidebar } from "@/components/globals/sidebars/app-sidebar";
import { ModeToggle } from "@/components/themes/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { capitalizeFirstLetter } from "@/helpers/global.helper";
import { DashboardLayoutProps } from "@/interfaces/components/globals/layouts/dashboard-layout.interface";
import { useEffect, useState } from "react";

import { NavLink, useLocation } from "react-router-dom";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { name: string; link: string }[]
  >([]);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    // hanya ambil data ke index ke 2 dst
    const newPathParts = pathParts.splice(2);

    setBreadcrumbs(
      newPathParts.map((part, index) => ({
        name: part.replace("-", " "),
        link: `/${pathParts[1]}/${newPathParts.slice(0, index + 1).join("/")}`,
      }))
    );

  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 bg-background flex h-16 shrink-0 items-center justify-between pr-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-50">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-base font-semibold block md:hidden">
                dashboard<span className="italic font-medium">.tif-usr</span>
              </span>
              <Breadcrumb className="hidden md:block">
                <BreadcrumbList>
                  <NavLink to={"/"} className={"hover:text-foreground/75"}>
                    Beranda
                  </NavLink>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {breadcrumbs.map((breadcrumb, index) => (
                    <BreadcrumbItem key={index}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>
                          {capitalizeFirstLetter(breadcrumb.name)}
                        </BreadcrumbPage>
                      ) : (
                        <NavLink
                          to={index === 0 ? "" : breadcrumb.link}
                          className={
                            index === 0
                              ? "hover:text-muted-foreground hover:cursor-not-allowed"
                              : "hover:text-foreground/75"
                          }
                        >
                          {capitalizeFirstLetter(breadcrumb.name)}
                        </NavLink>
                      )}
                      {index < breadcrumbs.length - 1 && (
                        <BreadcrumbSeparator className="hidden md:block" />
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ModeToggle />
          </header>

          <div className="flex flex-1 flex-col p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
