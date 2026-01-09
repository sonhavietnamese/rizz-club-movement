'use client'

import { AnimatedBackground } from '@/components/animated-background'
import { AnimatedFrame } from '@/components/animated-frame'
import { useLogout } from '@privy-io/react-auth'
import { useRouter } from 'next/navigation'

export default function UserPage() {
  const router = useRouter()
  const { logout } = useLogout({
    onSuccess: () => {
      router.push('/')
    },
  })

  const handleBackToLanding = () => {
    logout()
  }

  return (
    <main className="w-full h-full bg-background flex items-center justify-center">
      <AnimatedBackground variant="rest" />
      <AnimatedFrame variant="horizontal">
        <div>Register</div>
        <button className="text-white" onClick={handleBackToLanding}>
          Back to Landing
        </button>
      </AnimatedFrame>
    </main>
  )
}
