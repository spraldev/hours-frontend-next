"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface SuccessAnimationProps {
  show: boolean
  message?: string
  className?: string
}

export function SuccessAnimation({ show, message = "Success!", className }: SuccessAnimationProps) {
  if (!show) return null

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={`flex flex-col items-center justify-center ${className}`}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <CheckCircle className="h-16 w-16 text-green-500" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-2 text-lg font-semibold text-green-700 dark:text-green-300"
      >
        {message}
      </motion.p>
    </motion.div>
  )
}
