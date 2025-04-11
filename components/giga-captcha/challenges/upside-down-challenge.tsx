"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { ChallengeComponentProps } from "../types"

export function UpsideDownChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [inputText, setInputText] = useState("")
  const [timeLeft, setTimeLeft] = useState(challenge.data.timeLimit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { textToType, timeLimit } = challenge.data

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current!)
          onFailure()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [onFailure])

  const handleSubmit = () => {
    setIsSubmitting(true)

    if (timerRef.current) clearInterval(timerRef.current)

    setTimeout(() => {
      if (inputText.toLowerCase() === textToType.toLowerCase()) {
        onSuccess()
      } else {
        onFailure()
      }
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <p className="text-lg font-medium text-center transform rotate-180">{textToType}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Time left: {timeLeft}s</p>
          <p className="text-sm text-muted-foreground">{Math.round((timeLeft / timeLimit) * 100)}%</p>
        </div>
        <Progress value={(timeLeft / timeLimit) * 100} />
      </div>

      <div className="space-y-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type the text here (right-side up)"
          disabled={isSubmitting}
          className="text-center"
        />
        <p className="text-xs text-muted-foreground text-center">
          Type the text exactly as it would appear right-side up
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !inputText}>
          {isSubmitting ? "Verifying..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}
