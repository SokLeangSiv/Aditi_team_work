import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-125 w-full rounded-lg" />
    </div>
  )
}

export default LoadingPage