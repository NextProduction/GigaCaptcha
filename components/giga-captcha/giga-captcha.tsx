"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, RefreshCw, Laugh, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { MazeChallenge } from "./challenges/maze-challenge"
import { ChessChallenge } from "./challenges/chess-challenge"
import { OlympicQuizChallenge } from "./challenges/olympic-quiz-challenge"
import { WrongMathChallenge } from "./challenges/wrong-math-challenge"
import { MemeQuizChallenge } from "./challenges/meme-quiz-challenge"
import { UpsideDownChallenge } from "./challenges/upside-down-challenge"
import { TimingChallenge } from "./challenges/timing-challenge"
import { LoadingSpinner } from "./loading-spinner"
import { useGigaCaptchaConfig } from "./use-giga-captcha-config"
import type { Challenge, GigaCaptchaProps, VerificationStatus } from "./types"

export function GigaCaptcha({
  onVerify,
  theme = "light",
  difficulty = "medium",
  autoRefresh = true,
  refreshInterval = 120000, // 2 minutes
  enabledChallenges = ["maze", "chess", "olympicQuiz", "wrongMath", "memeQuiz", "upsideDown", "timing"],
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
  const {
    challenges,
    isLoading,
    error: configError,
  } = useGigaCaptchaConfig({
    enabledChallenges,
    difficulty,
  })
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
    if (challenges.length === 0) return null
    const randomIndex = Math.floor(Math.random() * challenges.length)
    return challenges[randomIndex]
  }, [challenges])

  const initializeChallenge = useCallback(() => {
    setStatus("loading")
    setError(null)

    // Generate a random funny message
    const randomMessageIndex = Math.floor(Math.random() * funnyMessages.length)
    setFunnyMessage(funnyMessages[randomMessageIndex])

    // Simulate network request for challenge data
    setTimeout(() => {
      try {
        if (configError) {
          throw new Error(configError)
        }

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
  }, [configError, funnyMessages, onError, selectRandomChallenge])

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
      switch (currentChallenge.type) {
        case "maze":
          return (
            <MazeChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        case "chess":
          return (
            <ChessChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        case "olympicQuiz":
          return (
            <OlympicQuizChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        case "wrongMath":
          return (
            <WrongMathChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        case "memeQuiz":
          return (
            <MemeQuizChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        case "upsideDown":
          return (
            <UpsideDownChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        case "timing":
          return (
            <TimingChallenge
              challenge={currentChallenge}
              onSuccess={handleVerificationSuccess}
              onFailure={handleVerificationFailure}
            />
          )
        default:
          return <div>Challenge type not supported</div>
      }
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
