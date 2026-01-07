'use client'

import { motion } from 'motion/react'

export function AnimatedBox({ variant }: { variant: 'home' | 'register' }) {
  return (
    <motion.div
      layoutId="shared-rect"
      className="bg-blue-500"
      initial={false}
      animate={{
        width: variant === 'home' ? 500 : 100,
        height: 500,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
      style={{
        borderRadius: 12,
      }}
    />
  )
}
