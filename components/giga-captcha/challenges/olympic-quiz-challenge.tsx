"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ChallengeComponentProps } from "../types"

export function OlympicQuizChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const { question, options, correctAnswer } = challenge.data

  const handleSubmit = () => {
    if (!selectedAnswer) return

    setIsSubmitting(true)

    setTimeout(() => {
      if (selectedAnswer === correctAnswer) {
        onSuccess()
      } else {
        onFailure()
      }
      setIsSubmitting(false)
    }, 1000)
  }

  const handleGiveUp = () => {
    onFailure()
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <p className="text-lg font-medium text-center">{question}</p>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="w-full cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {showHint && (
        <div className="text-sm italic text-muted-foreground p-2 bg-yellow-50 rounded-md">
          <p>Hint: Nobody knows this. Just guess! 😂</p>
        </div>
      )}

      <div className="flex justify-between">
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={handleGiveUp}>
            Give Up
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowHint(true)} disabled={showHint}>
            Hint
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedAnswer}>
          {isSubmitting ? "Verifying..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  )
}
