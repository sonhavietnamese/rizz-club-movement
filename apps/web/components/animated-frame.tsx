'use client'

import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { JSX } from 'react'

type Variant = 'default' | 'loading' | 'landing' | 'horizontal'

interface AnimatedFrameProps {
  variant: Variant
  children: JSX.Element | JSX.Element[]
}

const SIZES: Record<
  Variant,
  { width: number | string; height: number | string; background: string }
> = {
  default: {
    width: 0,
    height: 0,
    background: '#ffffff',
  },
  loading: {
    width: 70,
    height: 70,
    background: '#ffffff',
  },
  landing: {
    width: 500,
    height: 440,
    background: '#ffffff',
  },
  horizontal: {
    width: 540,
    height: '100%',
    background: '#141414',
  },
}

export function AnimatedFrame({
  variant = 'default',
  children,
}: AnimatedFrameProps) {
  return (
    <motion.section
      layoutId="shared-frame"
      initial={false}
      animate={{
        width: SIZES[variant].width,
        height: SIZES[variant].height,
        background: SIZES[variant].background,
      }}
      className={cn(
        'z-10 squircle rounded-[130px] overflow-hidden relative p-6',
        variant !== 'horizontal' &&
          "before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-[url('/textures/02.png')] before:z-0",
        variant !== 'horizontal' &&
          'before:bg-blend-lighten before:opacity-20 before:bg-cover before:bg-center'
      )}
    >
      {children}
    </motion.section>
  )
}
