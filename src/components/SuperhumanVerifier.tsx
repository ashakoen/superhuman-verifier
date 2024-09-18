'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

export interface SuperhumanVerifierProps {
  onVerificationComplete: (token: string) => void;
  verificationEndpoint?: string;
  size?: number;
  colors?: {
    background?: string;
    ring?: string;
    progress?: string;
    dot?: string;
  };
  texts?: {
    title?: string;
    instruction?: string;
    verified?: string;
  };
  timeRange?: {
    min: number;
    max: number;
  };
}

export const SuperhumanVerifier: React.FC<SuperhumanVerifierProps> = ({
  onVerificationComplete,
  verificationEndpoint = '/api/verify-superhuman',
  size = 64,
  colors = {},
  texts = {},
  timeRange = { min: 2, max: 5 },
}) => {
  const [isVerified, setIsVerified] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const ringRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const verificationTimeRef = useRef<number>(0)

  const {
    background = 'bg-gray-800',
    ring = 'bg-gray-700',
    progress: progressColor = 'bg-blue-500',
    dot = 'bg-blue-500',
  } = colors

  const {
    title = 'Superhuman Verifier',
    instruction = 'Center and hold to prove your power.',
    verified = 'Superhuman Verified!',
  } = texts

  const generateVerificationTime = useCallback(() => {
    return Math.floor(Math.random() * (timeRange.max - timeRange.min + 1) + timeRange.min) * 1000
  }, [timeRange])

  const verifySuperhuman = useCallback(async () => {
    try {
      const response = await fetch(verificationEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: Date.now(),
          verificationTime: verificationTimeRef.current,
        }),
      })
      const data = await response.json()
      if (data.success) {
        setIsVerified(true)
        onVerificationComplete(data.token)
      } else {
        setProgress(0)
        setIsHolding(false)
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setProgress(0)
      setIsHolding(false)
    }
  }, [verificationEndpoint, onVerificationComplete])

  const startVerification = useCallback((clientX: number, clientY: number) => {
    if (ringRef.current) {
      const ring = ringRef.current
      const rect = ring.getBoundingClientRect()
      const ringCenterX = rect.left + rect.width / 2
      const ringCenterY = rect.top + rect.height / 2

      const dx = clientX - ringCenterX
      const dy = clientY - ringCenterY
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 15) {
        setIsHolding(true)
        setProgress(0)
        verificationTimeRef.current = generateVerificationTime()
        startTimeRef.current = Date.now()
        timerRef.current = setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current
          const newProgress = Math.min((elapsed / verificationTimeRef.current) * 100, 100)
          setProgress(newProgress)
          if (newProgress >= 100) {
            clearInterval(timerRef.current as NodeJS.Timeout)
            verifySuperhuman()
          }
        }, 50)
      }
    }
  }, [generateVerificationTime, verifySuperhuman])

  const stopVerification = useCallback(() => {
    setIsHolding(false)
    setProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => startVerification(e.clientX, e.clientY)
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      startVerification(touch.clientX, touch.clientY)
    }

    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', stopVerification)
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', stopVerification)

    return () => {
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', stopVerification)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', stopVerification)
    }
  }, [startVerification, stopVerification])

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div 
        ref={ringRef}
        className={`rounded-full ${background} shadow-lg mb-8 relative cursor-pointer`}
        style={{ width: size, height: size }}
        role="button"
        aria-label={isVerified ? "Verification complete" : "Hold here to verify you're superhuman"}
        tabIndex={0}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className={`absolute inset-2 rounded-full ${ring}`}
          style={{ 
            background: `conic-gradient(from 0deg, ${isVerified ? '#10B981' : progressColor} ${progress}%, transparent ${progress}%)` 
          }}
        />
        <div className={`absolute inset-4 rounded-full ${background} flex items-center justify-center`}>
          <motion.div 
            className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-500' : dot}`}
            animate={{ scale: isHolding ? [1, 1.5, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-2">
          {isVerified ? verified : title}
        </h2>
        <p className="text-gray-400 text-lg">
          {isVerified ? "Your superhuman status is confirmed." : instruction}
        </p>
      </motion.div>
    </div>
  )
}
