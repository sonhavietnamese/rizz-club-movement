import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
    NEXT_PUBLIC_PRIVY_CLIENT_ID: z.string().min(1),
    NEXT_PUBLIC_API_URL: z.string().min(1),
    NEXT_PUBLIC_SIGNER_ID: z.string().min(1),
  },

  runtimeEnv: {
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_PRIVY_CLIENT_ID: process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SIGNER_ID: process.env.NEXT_PUBLIC_SIGNER_ID,
  },
})
