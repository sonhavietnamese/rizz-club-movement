'use client'

import { AnimatedBox } from '@/components/animated-box'

export default function RegisterPage() {
  return (
    <main className="flex items-center gap-6 p-10">
      <AnimatedBox variant="register" />

      <div>
        <h1 className="text-2xl font-bold">Register</h1>
        <p>Form content goes here</p>
      </div>
    </main>
  )
}
