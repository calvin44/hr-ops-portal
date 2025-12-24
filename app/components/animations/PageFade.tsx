'use client'

import { motion, Variants, HTMLMotionProps } from 'framer-motion'

interface PageFadeProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
}

export const PageFade = ({ children, className = '', variants, ...props }: PageFadeProps) => {
  return (
    <motion.div
      className={`flex h-full min-h-0 flex-col ${className}`}
      variants={variants || defaultVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  )
}
