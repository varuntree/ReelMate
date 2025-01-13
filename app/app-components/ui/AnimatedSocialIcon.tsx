'use client'

import { motion } from 'framer-motion'
import { Instagram, Youtube } from 'lucide-react'

interface AnimatedSocialIconProps {
  platform: 'TikTok' | 'Instagram' | 'YouTube'
  isConnected: boolean
  onClick: () => void
}

export function AnimatedSocialIcon({ platform, isConnected, onClick }: AnimatedSocialIconProps) {
  const iconVariants = {
    hover: { scale: 1.2, rotate: 15 },
    tap: { scale: 0.8, rotate: -15 },
  }

  const getIcon = () => {
    switch (platform) {
      case 'TikTok':
        return <TikTokIcon className="w-12 h-12" />
      case 'Instagram':
        return <Instagram className="w-12 h-12" />
      case 'YouTube':
        return <Youtube className="w-12 h-12" />
    }
  }

  const getColor = () => {
    switch (platform) {
      case 'TikTok':
        return 'bg-gray-100 hover:bg-gray-200'
      case 'Instagram':
        return 'bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200'
      case 'YouTube':
        return 'bg-red-100 hover:bg-red-200'
    }
  }

  return (
    <motion.div
      className={`rounded-full p-4 cursor-pointer ${getColor()} ${
        isConnected ? 'ring-4 ring-green-400' : ''
      }`}
      whileHover="hover"
      whileTap="tap"
      variants={iconVariants}
      onClick={onClick}
    >
      {getIcon()}
    </motion.div>
  )
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"  {...props}>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
    </svg>
  )
}

