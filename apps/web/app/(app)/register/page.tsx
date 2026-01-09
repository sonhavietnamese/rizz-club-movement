'use client'

import { AnimatedBackground } from '@/components/animated-background'
import { AnimatedFrame } from '@/components/animated-frame'
import RegisterStep1 from '@/components/register-step-1'
import RegisterStep2 from '@/components/register-step-2'
import RegisterStep3 from '@/components/register-step-3'
import RegisterStep4 from '@/components/register-step-4'
import { useRegisterStore } from '@/stores/register'

export default function RegisterPage() {
  const { step } = useRegisterStore()

  return (
    <main className="w-full h-full bg-background flex items-center justify-center">
      <AnimatedBackground variant="rest" />
      <AnimatedFrame variant="horizontal">
        {step === 1 ? (
          <RegisterStep1 />
        ) : step === 2 ? (
          <RegisterStep2 />
        ) : step === 3 ? (
          <RegisterStep3 />
        ) : (
          <RegisterStep4 />
        )}
      </AnimatedFrame>
    </main>
  )
}
