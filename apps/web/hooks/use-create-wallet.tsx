'use client'

import { useMutation } from '@tanstack/react-query'
import { env } from '@/env'

interface CreateWalletResponse {
  message: string
  address: string
  id: string
  chain_type: string
}

interface CreateWalletRequest {
  userId: string
}

export function useCreateWallet() {
  return useMutation<CreateWalletResponse, Error, CreateWalletRequest>({
    mutationFn: async ({ userId }: CreateWalletRequest) => {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/create-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create wallet')
      }

      return response.json()
    },
  })
}
