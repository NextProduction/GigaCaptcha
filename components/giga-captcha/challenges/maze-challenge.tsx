"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ChallengeComponentProps } from "../types"

export function MazeChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [playerPosition, setPlayerPosition] = useState({ x: challenge.data.start.x, y: challenge.data.start.y })
  const [path, setPath] = useState<Array<{ x: number; y: number }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { mazeSize, walls, end } = challenge.data
  const cellSize = 40
  const mazeWidth = mazeSize.width * cellSize
  const mazeHeight = mazeSize.height * cellSize

  // Draw the maze
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    for (let x = 0; x <= mazeSize.width; x++) {
      ctx.beginPath()
      ctx.moveTo(x * cellSize, 0)
      ctx.lineTo(x * cellSize, mazeHeight)
      ctx.stroke()
    }
    for (let y = 0; y <= mazeSize.height; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * cellSize)
      ctx.lineTo(mazeWidth, y * cellSize)
      ctx.stroke()
    }

    // Draw walls
    ctx.fillStyle = "#1f2937"
    walls.forEach((wall) => {
      ctx.fillRect(wall.x * cellSize, wall.y * cellSize, cellSize, cellSize)
    })

    // Draw start
    ctx.fillStyle = "#10b981"
    ctx.fillRect(challenge.data.start.x * cellSize, challenge.data.start.y * cellSize, cellSize, cellSize)
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px sans-serif"
    ctx.fillText("Start", challenge.data.start.x * cellSize + 5, challenge.data.start.y * cellSize + 25)

    // Draw end
    ctx.fillStyle = "#ef4444"
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillText("End", end.x * cellSize + 10, end.y * cellSize + 25)

    // Draw player
    ctx.fillStyle = "#3b82f6"
    ctx.beginPath()
    ctx.arc(
      playerPosition.x * cellSize + cellSize / 2,
      playerPosition.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Draw path
    if (path.length > 0) {
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(challenge.data.start.x * cellSize + cellSize / 2, challenge.data.start.y * cellSize + cellSize / 2)

      path.forEach((point) => {
        ctx.lineTo(point.x * cellSize + cellSize / 2, point.y * cellSize + cellSize / 2)
      })

      ctx.stroke()
      ctx.lineWidth = 1
    }
  }, [playerPosition, path, challenge.data, mazeSize, walls, end, cellSize, mazeWidth, mazeHeight])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault()

    let newX = playerPosition.x
    let newY = playerPosition.y

    switch (e.key) {
      case "ArrowUp":
        newY = Math.max(0, playerPosition.y - 1)
        break
      case "ArrowDown":
        newY = Math.min(mazeSize.height - 1, playerPosition.y + 1)
        break
      case "ArrowLeft":
        newX = Math.max(0, playerPosition.x - 1)
        break
      case "ArrowRight":
        newX = Math.min(mazeSize.width - 1, playerPosition.x + 1)
        break
      default:
        return
    }

    // Check if the new position is a wall
    const isWall = walls.some((wall) => wall.x === newX && wall.y === newY)
    if (isWall) return

    // Update player position
    setPlayerPosition({ x: newX, y: newY })
    setPath([...path, { x: newX, y: newY }])

    // Check if player reached the end
    if (newX === end.x && newY === end.y) {
      setIsSubmitting(true)
      setTimeout(() => {
        onSuccess()
      }, 500)
    }
  }

  const handleGiveUp = () => {
    onFailure()
  }

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex justify-center">
        <canvas ref={canvasRef} width={mazeWidth} height={mazeHeight} className="border rounded-md" />
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
        <div></div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newY = Math.max(0, playerPosition.y - 1)
            const isWall = walls.some((wall) => wall.x === playerPosition.x && wall.y === newY)
            if (!isWall) {
              setPlayerPosition({ ...playerPosition, y: newY })
              setPath([...path, { x: playerPosition.x, y: newY }])

              if (playerPosition.x === end.x && newY === end.y) {
                setIsSubmitting(true)
                setTimeout(() => {
                  onSuccess()
                }, 500)
              }
            }
          }}
        >
          ↑
        </Button>
        <div></div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newX = Math.max(0, playerPosition.x - 1)
            const isWall = walls.some((wall) => wall.x === newX && wall.y === playerPosition.y)
            if (!isWall) {
              setPlayerPosition({ ...playerPosition, x: newX })
              setPath([...path, { x: newX, y: playerPosition.y }])

              if (newX === end.x && playerPosition.y === end.y) {
                setIsSubmitting(true)
                setTimeout(() => {
                  onSuccess()
                }, 500)
              }
            }
          }}
        >
          ←
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newY = Math.min(mazeSize.height - 1, playerPosition.y + 1)
            const isWall = walls.some((wall) => wall.x === playerPosition.x && wall.y === newY)
            if (!isWall) {
              setPlayerPosition({ ...playerPosition, y: newY })
              setPath([...path, { x: playerPosition.x, y: newY }])

              if (playerPosition.x === end.x && newY === end.y) {
                setIsSubmitting(true)
                setTimeout(() => {
                  onSuccess()
                }, 500)
              }
            }
          }}
        >
          ↓
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newX = Math.min(mazeSize.width - 1, playerPosition.x + 1)
            const isWall = walls.some((wall) => wall.x === newX && wall.y === playerPosition.y)
            if (!isWall) {
              setPlayerPosition({ ...playerPosition, x: newX })
              setPath([...path, { x: newX, y: playerPosition.y }])

              if (newX === end.x && playerPosition.y === end.y) {
                setIsSubmitting(true)
                setTimeout(() => {
                  onSuccess()
                }, 500)
              }
            }
          }}
        >
          →
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleGiveUp}>
          Give Up
        </Button>
        <p className="text-xs text-muted-foreground">
          {isSubmitting ? "Verifying..." : "Use arrow keys or buttons to navigate"}
        </p>
      </div>
    </div>
  )
}
