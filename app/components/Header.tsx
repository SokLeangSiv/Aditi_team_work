// components/header.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bell } from "lucide-react"

type Props = {
    title: string;
    subTitle: string;
    link :string;
}

export function Header({title, subTitle, link}: Props) {
  return (
    <div className="flex w-full items-center justify-between px-6 py-2 border-b ">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <Badge variant="secondary">{subTitle}</Badge>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
        </Button>
        <Button>
          <Link href={link}>{`+ New ${title}`}</Link>
        </Button>
      </div>

    </div>
  );
}
