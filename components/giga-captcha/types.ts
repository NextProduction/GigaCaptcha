import type React from "react"

export type ChallengeType = "maze" | "chess" | "olympicQuiz" | "wrongMath" | "memeQuiz" | "upsideDown" | "timing"

export type DifficultyLevel = "easy" | "medium" | "hard" | "impossible"

export type VerificationStatus = "idle" | "loading" | "challenging" | "verifying" | "success" | "failed" | "error"

export interface Challenge {
  id: string
  type: ChallengeType
  name: string
  difficulty: DifficultyLevel
  instructions: string
  data: any
}

export interface VerificationResult {
  timestamp: number
  challengeType?: ChallengeType
  sessionId?: string
}

export interface AccessibilityLabels {
  title: string
  loading: string
  success: string
  failure: string
  refresh: string
}

export interface GigaCaptchaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback function that is called when verification is complete
   */
  onVerify?: (success: boolean, result: VerificationResult) => void

  /**
   * Callback function that is called when an error occurs
   */
  onError?: (error: string) => void

  /**
   * Theme of the captcha component
   * @default 'light'
   */
  theme?: "light" | "dark"

  /**
   * Difficulty level of the challenges
   * @default 'medium'
   */
  difficulty?: DifficultyLevel

  /**
   * Whether to automatically refresh the captcha after successful verification
   * @default true
   */
  autoRefresh?: boolean

  /**
   * Time in milliseconds after which the captcha will refresh after successful verification
   * @default 120000 (2 minutes)
   */
  refreshInterval?: number

  /**
   * List of challenge types to enable
   * @default ['maze', 'chess', 'olympicQuiz', 'wrongMath', 'memeQuiz', 'upsideDown', 'timing']
   */
  enabledChallenges?: ChallengeType[]

  /**
   * Custom accessibility labels
   */
  accessibilityLabels?: AccessibilityLabels
}

export interface ChallengeComponentProps {
  challenge: Challenge
  onSuccess: () => void
  onFailure: () => void
}
