"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check } from "lucide-react"
import type { ChallengeComponentProps } from "../types"

export function ImageSelectionChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { images, targetName } = challenge.data

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Check if all selected images are targets and all targets are selected
    const targetImages = images.filter((img) => img.isTarget)
    const targetIds = targetImages.map((img) => img.id)

    const allTargetsSelected = targetIds.every((id) => selectedImages.includes(id))
    const onlyTargetsSelected = selectedImages.every((id) => targetIds.includes(id))

    setTimeout(() => {
      if (allTargetsSelected && onlyTargetsSelected) {
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

      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={`
              relative aspect-square overflow-hidden rounded-md cursor-pointer border-2
              ${selectedImages.includes(image.id) ? "border-primary" : "border-transparent"}
              hover:opacity-90 transition-all
            `}
            onClick={() => toggleImageSelection(image.id)}
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={`Captcha image ${image.id}`}
              fill
              className="object-cover"
            />
            {selectedImages.includes(image.id) && (
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <Check className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || selectedImages.length === 0}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
      </div>
    </div>
  )
}
