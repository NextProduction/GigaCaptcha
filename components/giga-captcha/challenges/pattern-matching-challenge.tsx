"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check } from "lucide-react"
import type { ChallengeComponentProps } from "../types"

export function PatternMatchingChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { sequence, options } = challenge.data

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleSubmit = () => {
    if (!selectedOption) return

    setIsSubmitting(true)

    const selectedItem = options.find((opt) => opt.id === selectedOption)

    setTimeout(() => {
      if (selectedItem?.isCorrect) {
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

      <div className="flex items-center justify-center space-x-2 p-2 bg-muted rounded-md">
        {sequence.map((image, index) => (
          <div key={index} className="relative w-10 h-10">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Pattern item ${index + 1}`}
              fill
              className="object-contain"
            />
          </div>
        ))}
        <div className="w-10 h-10 flex items-center justify-center border-2 border-dashed border-muted-foreground rounded-md">
          ?
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <div
            key={option.id}
            className={`
              relative aspect-square overflow-hidden rounded-md cursor-pointer border-2
              ${selectedOption === option.id ? "border-primary" : "border-transparent"}
              hover:opacity-90 transition-all p-2 bg-muted/50
            `}
            onClick={() => handleOptionSelect(option.id)}
          >
            <Image
              src={option.src || "/placeholder.svg"}
              alt={`Option ${option.id}`}
              fill
              className="object-contain p-2"
            />
            {selectedOption === option.id && (
              <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !selectedOption}>
          {isSubmitting ? "Verifying..." : "Submit Answer"}
        </Button>
      </div>
    </div>
  )
}
