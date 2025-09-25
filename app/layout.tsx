import type React from "react"
import type { Metadata } from "next"
import { Kalam } from "next/font/google"
import "./globals.css"

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-kalam",
})

export const metadata: Metadata = {
  title: "UC - Contador Público Nacional | Quiz",
  description: "Quiz interactivo de Contador Público Nacional",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${kalam.variable} antialiased`}>
      <body className={`${kalam.className} min-h-screen`}>{children}</body>
    </html>
  )
}
