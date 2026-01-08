import { AnimatedFrame } from '@/components/animated-frame'
import { AnimatedBackground } from '@/components/animated-background'

export default function Loading() {
  return (
    <main className="w-screen h-screen bg-background flex items-center justify-center">
      <AnimatedBackground variant="landing" />
      <AnimatedFrame variant="landing">
        <div>Loading...</div>
      </AnimatedFrame>
    </main>
  )
}
