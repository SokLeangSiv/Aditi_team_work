"use client";
import { FolderOpenDot, House, ListTodo } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import SearchInput from "../Search_Input";
import UserProfile from "./User_Profile";
import { SidebarLogo } from "./sidebar-header";
import { ModeToggle } from "@/components/toggle-dark-mode";

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
                  (pathname === item.url || pathname?.startsWith(item.url));

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
      </SidebarContent>
      <UserProfile />
    </Sidebar>
  );
}
