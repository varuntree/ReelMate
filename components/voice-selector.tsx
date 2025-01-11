import { useState } from "react"
import { Check, Volume2, Play } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Voice {
  id: string
  name: string
  description: string
  gradient: string
}

const voices: Voice[] = [
  {
    id: "1",
    name: "Alice",
    description: "Natural and friendly voice, perfect for narration",
    gradient: "bg-gradient-to-br from-fuchsia-500 via-red-600 to-orange-400",
  },
  {
    id: "2",
    name: "Bob",
    description: "Deep and professional voice for business content",
    gradient: "bg-gradient-to-br from-green-300 via-blue-500 to-purple-600",
  },
  {
    id: "3",
    name: "Charlie",
    description: "Energetic and upbeat voice for engaging content",
    gradient: "bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400",
  },
  {
    id: "4",
    name: "Diana",
    description: "Calm and soothing voice for meditation content",
    gradient: "bg-gradient-to-br from-yellow-200 via-green-200 to-green-500",
  }
]

export default function VoiceSelector() {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
  const [hoveredVoice, setHoveredVoice] = useState<string | null>(null)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  const handlePlay = (voiceId: string) => {
    setPlayingVoice(voiceId)
    // Here you would typically trigger the voice preview playback
    // For demonstration, we'll just use a timeout to simulate playback
    setTimeout(() => setPlayingVoice(null), 3000)
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Voice</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {voices.map((voice) => (
            <Card
              key={voice.id}
              onMouseEnter={() => setHoveredVoice(voice.id)}
              onMouseLeave={() => setHoveredVoice(null)}
              onClick={() => setSelectedVoice(voice.id)}
              className={cn(
                "relative cursor-pointer transition-all duration-300 transform",
                "border-2",
                hoveredVoice === voice.id && "scale-105 shadow-xl",
                selectedVoice === voice.id 
                  ? "border-primary shadow-lg" 
                  : "border-transparent hover:border-primary/50"
              )}
            >
              <div className="p-6 flex items-start gap-6">
                <div
                  className={cn(
                    "w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center",
                    "transform transition-all duration-300",
                    voice.gradient,
                    hoveredVoice === voice.id && "scale-110 rotate-12"
                  )}
                >
                  {hoveredVoice === voice.id && (
                    <Volume2 className="w-8 h-8 text-white animate-pulse" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{voice.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {voice.description}
                  </p>
                </div>
                {selectedVoice === voice.id && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </div>
              {hoveredVoice === voice.id && (
                <div 
                  className={cn(
                    "absolute inset-0 rounded-lg opacity-10",
                    voice.gradient
                  )}
                />
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "absolute bottom-4 right-4 rounded-full",
                      playingVoice === voice.id && "animate-pulse bg-primary text-primary-foreground"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlay(voice.id)
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                    <span className="sr-only">{voice.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview {voice.name}</p>
                </TooltipContent>
              </Tooltip>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}

