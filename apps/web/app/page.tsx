'use client'

import Test from '@/components/test'
import { useLoginWithOAuth, usePrivy } from '@privy-io/react-auth'

export default function Page() {
  const { ready, authenticated } = usePrivy()

  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ user, isNewUser }) => {
      console.log('User logged in successfully', user)
      if (isNewUser) {
        // Perform actions for new users
      }
    },
    onError: (error) => {
      console.error('Login failed', error)
    },
  })

  const handleLogin = async () => {
    try {
      // The user will be redirected to OAuth provider's login page
      await initOAuth({ provider: 'google' })
    } catch (err) {
      // Handle errors (network issues, validation errors, etc.)
      console.error(err)
    }
  }

  if (!ready) return <div>Loading...</div>

  return (
    <main className="w-screen h-screen bg-black">
      <button
        className="my-4 w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:bg-indigo-400"
        onClick={handleLogin}
        // Always check that Privy is `ready` and the user is not `authenticated` before calling `login`
        disabled={!ready || authenticated}
      >
        Login
      </button>

      <Test />
    </main>
  )
}
