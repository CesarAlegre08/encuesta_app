"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function WelcomePage() {
  const [playerName, setPlayerName] = useState("")
  const router = useRouter()

  console.log("[v0] WelcomePage rendered")

  const handleStartQuiz = () => {
    console.log("[v0] Starting voting with participant:", playerName)
    if (playerName.trim()) {
      // Store player name in localStorage for the voting
      localStorage.setItem("playerName", playerName.trim())
      router.push("/voting")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStartQuiz()
    }
  }

  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Logo and Title Section */}
        <div className="space-y-6">
          {/* UC Logo with Flowers */}
          <div className="flex justify-center">
            <Image
              src="/images/logo-flowers.png"
              alt="Decorative flowers"
              width={200}
              height={60}
              className="opacity-90"
              priority
            />
          </div>

          {/* Subtitle */}
          <h2 className="text-white text-2xl font-normal italic">Contador Público Nacional</h2>
        </div>

        {/* Question Section */}
        <div className="space-y-6 pt-8">
          <p className="text-white text-xl font-normal">
            ¿Estás listo/a para participar en nuestra encuesta divertida?
          </p>

          {/* Name Input */}
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Ingrese su nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full h-14 text-lg text-center bg-white/90 border-0 rounded-3xl placeholder:text-purple-600/70 text-purple-800 font-medium"
            />

            {/* Start Button */}
            <Button
              onClick={handleStartQuiz}
              disabled={!playerName.trim()}
              className="w-full h-14 text-xl font-medium bg-white/90 hover:bg-white text-purple-800 rounded-3xl border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comenzar Encuesta
            </Button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-white/20 text-4xl animate-pulse">🌸</div>
        <div className="absolute top-20 right-10 text-white/20 text-3xl animate-pulse delay-1000">🌺</div>
        <div className="absolute bottom-20 left-8 text-white/20 text-3xl animate-pulse delay-2000">🌸</div>
        <div className="absolute bottom-32 right-12 text-white/20 text-4xl animate-pulse delay-500">🌺</div>
      </div>
    </div>
  )
}
