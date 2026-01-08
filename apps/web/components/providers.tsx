'use client'

import { PrivyProvider } from '@privy-io/react-auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { env } from '@/env'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
})

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={env.NEXT_PUBLIC_PRIVY_APP_ID}
        clientId={env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
      >
        {children}
      </PrivyProvider>
    </QueryClientProvider>
  )
}
