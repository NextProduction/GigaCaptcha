"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { ChallengeComponentProps } from "../types"

export function SliderPuzzleChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [position, setPosition] = useState({ x: 50, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const puzzlePieceRef = useRef<HTMLDivElement>(null)

  const { backgroundImage, puzzlePiece, targetPosition, tolerance } = challenge.data

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left - 25, rect.width - 50))
    const y = Math.max(0, Math.min(e.clientY - rect.top - 25, rect.height - 50))

    setPosition({ x, y })
  }

  const handleMouseUp = () => {
    if (!isDragging) return

    setIsDragging(false)

    // Check if the puzzle piece is in the correct position
    const isCorrectX = Math.abs(position.x - targetPosition.x) <= tolerance
    const isCorrectY = Math.abs(position.y - targetPosition.y) <= tolerance

    if (isCorrectX && isCorrectY) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSuccess()
        setIsSubmitting(false)
      }, 1000)
    }
  }

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
      }
    }

    window.addEventListener("mouseup", handleGlobalMouseUp)
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div className="space-y-4">
      <p className="text-sm">{challenge.instructions}</p>

      <div
        ref={containerRef}
        className="relative h-48 w-full rounded-md overflow-hidden border cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Image src={backgroundImage || "/placeholder.svg"} alt="Puzzle background" fill className="object-cover" />

        <div
          ref={puzzlePieceRef}
          className={`absolute w-12 h-12 rounded-md shadow-md cursor-grab ${isDragging ? "cursor-grabbing" : ""}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: "none",
          }}
          onMouseDown={handleMouseDown}
        >
          <Image src={puzzlePiece || "/placeholder.svg"} alt="Puzzle piece" fill className="object-cover rounded-md" />
        </div>
      </div>

      <div className="text-sm text-center text-muted-foreground">
        {isSubmitting ? "Verifying..." : "Drag the puzzle piece to the correct position"}
      </div>
    </div>
  )
}
