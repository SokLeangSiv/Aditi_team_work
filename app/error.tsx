"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-xl font-semibold">
        Something went wrong 😢
      </h2>

      <p className="text-sm text-muted-foreground max-w-md text-center">
        {error.message || "An unexpected error occurred."}
      </p>

      <div className="flex gap-2">
        <Button onClick={() => reset()}>
          Try again
        </Button>

        <Button
          variant="outline"
          onClick={() => window.location.href = "/"}
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}
