"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import type { ChallengeComponentProps } from "../types"

export function MemeQuizChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setup, options, correctAnswer, memeImage } = challenge.data

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

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative w-full h-[150px]">
          <Image src={memeImage || "/placeholder.svg"} alt="Meme" fill className="object-contain" />
        </div>
      </div>

      <div className="p-3 bg-muted rounded-md">
        <p className="text-lg font-medium text-center">{setup || "What is this meme?"}</p>
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

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedAnswer}>
          {isSubmitting ? "Verifying..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  )
}
