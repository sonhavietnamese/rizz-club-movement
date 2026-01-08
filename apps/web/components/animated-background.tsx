'use client'

import { AnimatePresence, motion } from 'motion/react'

interface AnimatedBackgroundProps {
  variant: 'landing' | 'rest'
}

export function AnimatedBackground({ variant }: AnimatedBackgroundProps) {
  return (
    <motion.div
      layoutId="shared-background"
      initial={false}
      className="w-full h-full object-cover absolute top-0 left-0 z-0"
    >
      <AnimatePresence>
        {variant === 'landing' && (
          <motion.video
            animate={{
              opacity: variant === 'landing' ? 1 : 0,
            }}
            exit={{
              opacity: 0,
            }}
            draggable={false}
            src={'/videos/1228.mp4'}
            className="w-full h-full object-cover absolute top-0 left-0 z-0"
            autoPlay
            muted
            loop
          />
        )}
        {variant === 'rest' && (
          <motion.div
            animate={{
              opacity: variant === 'rest' ? 1 : 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="bg-background w-full h-full"
          ></motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
