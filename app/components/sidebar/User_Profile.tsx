"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import { LogOut } from 'lucide-react';


export default function UserProfile() {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile
  return (
    <div
      className={`flex items-center gap-3 p-4 border-t transition-all ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <Avatar className="h-10 w-9">
        <AvatarImage src="/raksa.png" alt="John Doe" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>

      {!isCollapsed && (
        <>
          <div className="text-sm">
            <p className="font-medium">Raksa Chamrong</p>
            <p className="text-muted-foreground">raksa@example.com</p>
          </div>
          <div className="ms-auto">
            <LogOut size={20} />
          </div>
        </>
      )}
    </div>
  );
}
