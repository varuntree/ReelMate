'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSocialIcon } from '@/app/app-components/ui/AnimatedSocialIcon'

export default function ConnectAccounts() {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([])

  const handleConnect = (platform: string) => {
    if (connectedPlatforms.includes(platform)) {
      setConnectedPlatforms(connectedPlatforms.filter(p => p !== platform))
    } else {
      setConnectedPlatforms([...connectedPlatforms, platform])
    }
  }

  const platforms = ['TikTok', 'Instagram', 'YouTube']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
          Connect Your Socials
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Link your accounts to start creating AI-powered reels!
        </p>
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">Choose Your Platforms</CardTitle>
            <CardDescription className="text-gray-600">Tap to connect or disconnect</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="flex justify-around"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.3
                  }
                }
              }}
            >
              {platforms.map((platform) => (
                <AnimatedSocialIcon
                  key={platform}
                  platform={platform as 'TikTok' | 'Instagram' | 'YouTube'}
                  isConnected={connectedPlatforms.includes(platform)}
                  onClick={() => handleConnect(platform)}
                />
              ))}
            </motion.div>
          </CardContent>
        </Card>
        <motion.div
          className="mt-8 text-center text-gray-800 text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {connectedPlatforms.length > 0 ? (
            <p>Connected to: {connectedPlatforms.join(', ')}</p>
          ) : (
            <p>No platforms connected yet</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
} 