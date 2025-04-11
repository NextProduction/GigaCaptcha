"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { ChallengeComponentProps } from "../types"

export function WrongMathChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const { question, options, wrongAnswers } = challenge.data

  const handleSubmit = () => {
    if (!selectedAnswer) return

    setIsSubmitting(true)

    setTimeout(() => {
      if (wrongAnswers.includes(selectedAnswer)) {
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
        <p className="text-lg font-medium text-center">{question}</p>
        <p className="text-sm text-center text-red-500 font-bold mt-2">Remember: Select the WRONG answer!</p>
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
          <p>Hint: The correct answer is {options.find((o) => !wrongAnswers.includes(o))}, so don't pick that one!</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => setShowHint(true)} disabled={showHint}>
          Hint
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedAnswer}>
          {isSubmitting ? "Verifying..." : "Submit Wrong Answer"}
        </Button>
      </div>
    </div>
  )
}
