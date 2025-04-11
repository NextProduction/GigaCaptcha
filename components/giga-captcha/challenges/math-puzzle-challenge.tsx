"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ChallengeComponentProps } from "../types"

export function MathPuzzleChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { question, answer, options } = challenge.data

  const handleSubmit = () => {
    if (!selectedAnswer) return

    setIsSubmitting(true)

    setTimeout(() => {
      if (selectedAnswer === answer) {
        onSuccess()
      } else {
        onFailure()
      }
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm">{challenge.instructions}</p>

      <div className="p-4 bg-muted rounded-md">
        <p className="text-lg font-medium text-center">{question}</p>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
        <div className="grid grid-cols-2 gap-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedAnswer}>
          {isSubmitting ? "Verifying..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  )
}
