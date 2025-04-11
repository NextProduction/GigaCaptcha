"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ChallengeComponentProps } from "../types"

export function TimingChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [result, setResult] = useState<"success" | "failure" | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [difference, setDifference] = useState(0)
  const startTimeRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const { targetTime, tolerance } = challenge.data

  const startTimer = () => {
    setIsRunning(true)
    setElapsedTime(0)
    startTimeRef.current = Date.now()

    const updateTimer = () => {
      const now = Date.now()
      const elapsed = (now - startTimeRef.current!) / 1000
      setElapsedTime(elapsed)
      animationFrameRef.current = requestAnimationFrame(updateTimer)
    }

    animationFrameRef.current = requestAnimationFrame(updateTimer)
  }

  const stopTimer = () => {
    if (!isRunning) return

    setIsRunning(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const timeDifference = Math.abs(elapsedTime - targetTime)
    setDifference(timeDifference)

    if (timeDifference <= tolerance) {
      setResult("success")
      setShowResult(true)
      setTimeout(() => {
        onSuccess()
      }, 1500)
    } else {
      setResult("failure")
      setShowResult(true)
      setTimeout(() => {
        onFailure()
      }, 1500)
    }
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md text-center">
        <p className="text-lg font-medium">Target time: {targetTime} seconds</p>
        <p className="text-sm text-muted-foreground mt-1">(Allowed margin: ±{tolerance} seconds)</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Elapsed time:</p>
          <p className="text-sm font-mono">{elapsedTime.toFixed(1)}s</p>
        </div>
        <Progress value={(elapsedTime / (targetTime * 2)) * 100} max={100} />
      </div>

      {showResult && (
        <div className={`p-3 rounded-md text-center ${result === "success" ? "bg-green-100" : "bg-red-100"}`}>
          <p className={result === "success" ? "text-green-700" : "text-red-700"}>
            {result === "success"
              ? `Perfect! You were only ${difference.toFixed(2)}s off.`
              : `Too ${elapsedTime > targetTime ? "slow" : "fast"}! You were ${difference.toFixed(2)}s off.`}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        {!isRunning ? (
          <Button onClick={startTimer} disabled={showResult}>
            Start Timer
          </Button>
        ) : (
          <Button onClick={stopTimer} variant="destructive">
            Stop at {targetTime}s!
          </Button>
        )}
      </div>
    </div>
  )
}
