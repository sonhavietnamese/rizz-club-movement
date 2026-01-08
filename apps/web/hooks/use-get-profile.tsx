'use client'

import { useQuery } from '@tanstack/react-query'
import { env } from '@/env'

interface GetProfileResponse {
  message: string
  profile: {
    username: string
    links: Array<{ provider: string; link: string }>
    pfp: string
    configs: number[]
    followers: string[]
    following: string[]
    types: number[]
  } | null
}

interface GetProfileRequest {
  userId: string
}

export function useGetProfile(
  userId: string | undefined,
  enabled: boolean = false
) {
  return useQuery<GetProfileResponse, Error>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is required')
      }

      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/get-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch profile')
      }

      return response.json()
    },
    enabled: enabled && !!userId,
    retry: false,
  })
}
