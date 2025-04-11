"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Check, RefreshCw, Laugh, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import the ChessChallenge component with { ssr: false }
const ChessChallenge = dynamic(() => import("./chess-challenge").then((mod) => mod.ChessChallenge), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col justify-center items-center h-48">
      <div className="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent h-6 w-6 text-yellow-500"></div>
      <p className="mt-4 text-sm text-muted-foreground">Loading chess challenge...</p>
    </div>
  ),
})

// Types
export type ChallengeType = "chess"
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
  onVerify?: (success: boolean, result: VerificationResult) => void
  onError?: (error: string) => void
  theme?: "light" | "dark"
  difficulty?: DifficultyLevel
  autoRefresh?: boolean
  refreshInterval?: number
  enabledChallenges?: ChallengeType[]
  accessibilityLabels?: AccessibilityLabels
}

export interface ChallengeComponentProps {
  challenge: Challenge
  onSuccess: () => void
  onFailure: () => void
}

// Loading spinner component
function LoadingSpinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
        size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : "h-8 w-8",
        "text-yellow-500",
        className,
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Chess challenge database
const chessDatabase: Challenge[] = [
  {
    id: "chess-1",
    type: "chess",
    name: "Chess Challenge",
    difficulty: "medium",
    instructions: "Find the checkmate in 1 move (even if you don't play chess)",
    data: {
      fen: "r1bqkb1r/pppp1Qpp/2n2n2/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4",
      correctMove: "e8d7", // King moves to d7
    },
  },
  {
    id: "chess-2",
    type: "chess",
    name: "Chess Challenge",
    difficulty: "easy",
    instructions: "Find the checkmate in 1 move (it's super obvious)",
    data: {
      fen: "k7/8/8/8/8/8/R7/7K w - - 0 1",
      correctMove: "a2a8", // Rook to a8 is checkmate
    },
  },
  {
    id: "chess-3",
    type: "chess",
    name: "Chess Challenge",
    difficulty: "hard",
    instructions: "Find the checkmate in 1 move (this one's tricky)",
    data: {
      fen: "r3k2r/ppp2p1p/2n1p1p1/8/2B2P1q/2NPb1n1/PP4PP/R2Q1RK1 b kq - 0 1",
      correctMove: "h4f2", // Queen to f2 is checkmate
    },
  },
]

export function GigaCaptcha({
  onVerify,
  theme = "light",
  difficulty = "medium",
  autoRefresh = true,
  refreshInterval = 120000, // 2 minutes
  enabledChallenges = ["chess"],
  className,
  accessibilityLabels = {
    title: "GigaCaptcha Verification",
    loading: "Loading challenge",
    success: "Verification successful",
    failure: "Verification failed",
    refresh: "Get a new challenge",
  },
  onError,
  ...props
}: GigaCaptchaProps) {
  const [status, setStatus] = useState<VerificationStatus>("idle")
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null)
  const [failCount, setFailCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [funnyMessage, setFunnyMessage] = useState("")

  const funnyMessages = [
    "Are you SURE you're not a robot? 🤔",
    "Even my grandma could solve this one! 👵",
    "This challenge is so easy, my pet rock could do it! 🪨",
    "If you fail this, you might be a toaster. 🍞",
    "Robots hate this one simple trick!",
    "Plot twist: We're ALL robots! 🤖",
    "This test separates the humans from the... well, you know.",
    "Congratulations! You've unlocked: HARDER CHALLENGES! 🎉",
    "Are your human credentials up to date?",
    "Please prove you're not three raccoons in a trenchcoat.",
  ]

  const selectRandomChallenge = useCallback(() => {
    // For now, we're only using chess challenges
    const filteredChallenges = chessDatabase.filter(
      (challenge) =>
        enabledChallenges.includes(challenge.type) && (difficulty === "medium" || challenge.difficulty === difficulty),
    )

    if (filteredChallenges.length === 0) return chessDatabase[0]
    const randomIndex = Math.floor(Math.random() * filteredChallenges.length)
    return filteredChallenges[randomIndex]
  }, [enabledChallenges, difficulty])

  const initializeChallenge = useCallback(() => {
    setStatus("loading")
    setError(null)

    // Generate a random funny message
    const randomMessageIndex = Math.floor(Math.random() * funnyMessages.length)
    setFunnyMessage(funnyMessages[randomMessageIndex])

    // Simulate network request for challenge data
    setTimeout(() => {
      try {
        const challenge = selectRandomChallenge()
        if (!challenge) {
          throw new Error("No challenges available")
        }

        setCurrentChallenge(challenge)
        setStatus("challenging")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load challenge"
        setError(errorMessage)
        setStatus("error")
        if (onError) {
          onError(errorMessage)
        }
      }
    }, 800)
  }, [funnyMessages, onError, selectRandomChallenge])

  const handleRefresh = useCallback(() => {
    setStatus("idle")
    setCurrentChallenge(null)
    setTimeout(initializeChallenge, 300)
  }, [initializeChallenge])

  const handleVerificationSuccess = useCallback(() => {
    setStatus("verifying")
    // Simulate verification process
    setTimeout(() => {
      setStatus("success")
      setFailCount(0)
      if (onVerify) {
        onVerify(true, {
          timestamp: Date.now(),
          challengeType: currentChallenge?.type,
          sessionId: `giga-${Date.now().toString(36)}`,
        })
      }
    }, 1000)
  }, [currentChallenge?.type, onVerify])

  const handleVerificationFailure = useCallback(() => {
    setFailCount((prev) => prev + 1)
    setStatus("failed")
    setTimeout(() => {
      handleRefresh()
    }, 2000)
  }, [handleRefresh])

  useEffect(() => {
    if (status === "idle") {
      initializeChallenge()
    }
  }, [status, initializeChallenge])

  // Auto refresh after interval
  useEffect(() => {
    if (!autoRefresh || status !== "success") return

    const timer = setTimeout(() => {
      handleRefresh()
    }, refreshInterval)

    return () => clearTimeout(timer)
  }, [autoRefresh, refreshInterval, status, handleRefresh])

  const renderChallenge = () => {
    if (!currentChallenge) return null

    try {
      if (currentChallenge.type === "chess") {
        return (
          <ChessChallenge
            challenge={currentChallenge}
            onSuccess={handleVerificationSuccess}
            onFailure={handleVerificationFailure}
          />
        )
      }
      return <div>Challenge type not supported</div>
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to render challenge"
      setError(errorMessage)
      setStatus("error")
      if (onError) {
        onError(errorMessage)
      }
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error rendering challenge. Please try refreshing.</AlertDescription>
        </Alert>
      )
    }
  }

  return (
    <Card
      className={cn(
        "w-full max-w-md overflow-hidden",
        theme === "dark" ? "bg-slate-900 text-white" : "bg-white",
        className,
      )}
      {...props}
      aria-label={accessibilityLabels.title}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Laugh className="h-5 w-5 text-yellow-500" />
            GigaCaptcha
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Fun Edition</span>
          </CardTitle>
          {status === "success" && (
            <div className="flex items-center text-green-500 text-sm font-medium">
              <Check className="mr-1 h-4 w-4" />
              Human-ish!
            </div>
          )}
        </div>
        <CardDescription>
          {status === "idle" || status === "loading"
            ? "Preparing a ridiculous challenge..."
            : status === "challenging"
              ? `${currentChallenge?.instructions} (Good luck, human! 😂)`
              : status === "verifying"
                ? "Checking if you're actually human or just a clever AI..."
                : status === "success"
                  ? "Congrats! You've proven you're not a robot... for now! 🎉"
                  : status === "error"
                    ? "Oops! Something went wrong."
                    : "Nice try, robot! Or just a confused human? 🤔"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {status === "loading" ? (
          <div
            className="flex flex-col justify-center items-center h-48"
            aria-live="polite"
            aria-label={accessibilityLabels.loading}
          >
            <LoadingSpinner />
            <p className="mt-4 text-sm text-muted-foreground italic">{funnyMessage}</p>
          </div>
        ) : status === "verifying" ? (
          <div className="flex flex-col justify-center items-center h-48" aria-live="polite">
            <LoadingSpinner />
            <p className="mt-4 text-sm text-muted-foreground italic">Analyzing your human-ness...</p>
          </div>
        ) : status === "challenging" ? (
          <div aria-live="polite">{renderChallenge()}</div>
        ) : status === "success" ? (
          <div
            className="flex flex-col items-center justify-center h-32 text-center"
            aria-live="polite"
            aria-label={accessibilityLabels.success}
          >
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">
              You've passed our ridiculous test! You're definitely (probably) human!
            </p>
          </div>
        ) : status === "failed" ? (
          <div
            className="flex flex-col items-center justify-center h-32 text-center"
            aria-live="polite"
            aria-label={accessibilityLabels.failure}
          >
            <p className="text-sm text-red-500 mb-2">
              {failCount > 2 ? "Hmm... are you SURE you're not a robot? 🤖" : "That's not quite right!"}
            </p>
            <p className="text-sm text-muted-foreground">Let's try another absurd challenge!</p>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center justify-center h-32 text-center" aria-live="assertive">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || "Something went wrong. Please try again."}</AlertDescription>
            </Alert>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center border-t">
        <div className="text-xs text-muted-foreground">Making bots cry since 2023</div>
        {status !== "loading" && status !== "verifying" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={status === "loading" || status === "verifying"}
            aria-label={accessibilityLabels.refresh}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            New Challenge
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
