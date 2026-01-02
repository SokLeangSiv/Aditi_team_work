// app/not-found.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-muted/30 to-background" />

      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="text-7xl font-bold tracking-tight text-muted-foreground">
            404
          </div>

          <Separator />

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Page not found
            </h1>
            <p className="text-sm text-muted-foreground">
              The page you’re looking for doesn’t exist, was moved,
              or you may not have access.
            </p>
          </div>

          <div className="flex w-full gap-3 pt-4">
            <Button asChild className="flex-1">
              <Link href="/">Go to dashboard</Link>
            </Button>

            <Button variant="outline" asChild className="flex-1">
              <Link href="/tasks">View tasks</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground pt-2">
            If you believe this is a mistake, try refreshing or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
