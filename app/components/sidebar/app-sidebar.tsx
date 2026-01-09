"use client";
import { FolderOpenDot, House, ListTodo } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import SearchInput from "../Search_Input";
import UserProfile from "./User_Profile";
import { SidebarLogo } from "./sidebar-header";
import { ModeToggle } from "@/components/toggle-dark-mode";
import { getProjects, type Project } from "@/lib/project";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: House,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: ListTodo,
  },
  {
    title: "Projects",
    url: "/projects",
    icon: FolderOpenDot,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projectItems = projects ?? [];
  return (
    <Sidebar collapsible="icon">
      <SidebarLogo />
      <div className="m-auto my-2">
        <ModeToggle/>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SearchInput />

          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  item.url !== "#" &&
                  (item.url === "/"
                    ? pathname === "/"
                    : pathname === item.url || pathname?.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && projectItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>PROJECTS</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projectItems.map((project) => {
                  const projectUrl = `/projects/${project.id}`;
                  const isActive = pathname === projectUrl;

                  return (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={projectUrl}>
                          <span
                            className={`h-2 w-2 shrink-0 rounded-full ${project.color}`}
                            aria-hidden="true"
                          />
                          <span>{project.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <UserProfile />
    </Sidebar>
  );
}
