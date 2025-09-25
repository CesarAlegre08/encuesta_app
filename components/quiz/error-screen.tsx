"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ErrorScreenProps {
  error: string
  onRetry?: () => void
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  const router = useRouter()

  return (
    <div className="gradient-bg flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        <div className="text-white space-y-4">
          <div className="text-6xl">❌</div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: "Kalam, cursive" }}>
            ¡Oops!
          </h2>
          <p className="text-lg" style={{ fontFamily: "Kalam, cursive" }}>
            {error}
          </p>
          <div className="space-y-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="w-full h-12 text-lg font-medium bg-white/90 hover:bg-white text-purple-800 rounded-3xl"
                style={{ fontFamily: "Kalam, cursive" }}
              >
                Intentar de nuevo
              </Button>
            )}
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full h-12 text-lg font-medium bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-800 rounded-3xl"
              style={{ fontFamily: "Kalam, cursive" }}
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-white/20 text-4xl animate-pulse">🌸</div>
      <div className="absolute top-20 right-10 text-white/20 text-3xl animate-pulse delay-1000">🌺</div>
      <div className="absolute bottom-20 left-8 text-white/20 text-3xl animate-pulse delay-2000">🌸</div>
      <div className="absolute bottom-32 right-12 text-white/20 text-4xl animate-pulse delay-500">🌺</div>
    </div>
  )
}
