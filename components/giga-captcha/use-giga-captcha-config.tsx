"use client"

import { useMemo, useState, useEffect } from "react"
import type { Challenge, ChallengeType, DifficultyLevel } from "./types"

// This would typically come from an API or config file
const challengeDatabase: Record<ChallengeType, Challenge[]> = {
  maze: [
    {
      id: "maze-1",
      type: "maze",
      name: "Maze Challenge",
      difficulty: "medium",
      instructions: "Solve this incredibly simple maze that a 5-year-old could do",
      data: {
        mazeSize: { width: 5, height: 5 },
        start: { x: 0, y: 0 },
        end: { x: 4, y: 4 },
        walls: [
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 2 },
          { x: 3, y: 2 },
          { x: 3, y: 3 },
          { x: 3, y: 4 },
          { x: 2, y: 0 },
          { x: 4, y: 2 },
        ],
      },
    },
    {
      id: "maze-2",
      type: "maze",
      name: "Maze Challenge",
      difficulty: "hard",
      instructions: "Navigate through this 'complex' maze (it's really not)",
      data: {
        mazeSize: { width: 6, height: 6 },
        start: { x: 0, y: 0 },
        end: { x: 5, y: 5 },
        walls: [
          { x: 1, y: 0 },
          { x: 1, y: 1 },
          { x: 1, y: 2 },
          { x: 1, y: 4 },
          { x: 2, y: 4 },
          { x: 3, y: 1 },
          { x: 3, y: 2 },
          { x: 3, y: 3 },
          { x: 3, y: 5 },
          { x: 4, y: 3 },
          { x: 5, y: 1 },
          { x: 5, y: 3 },
        ],
      },
    },
  ],
  chess: [
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
  ],
  olympicQuiz: [
    {
      id: "olympic-1",
      type: "olympicQuiz",
      name: "Olympic Quiz",
      difficulty: "hard",
      instructions: "Answer this Olympic trivia question that nobody knows",
      data: {
        question: "Who won the gold medal in the men's 100m butterfly swimming at the 1992 Barcelona Olympics?",
        options: ["Pablo Morales", "Michael Gross", "Anthony Nesty", "Melvin Stewart"],
        correctAnswer: "Pablo Morales",
      },
    },
    {
      id: "olympic-2",
      type: "olympicQuiz",
      name: "Olympic Quiz",
      difficulty: "impossible",
      instructions: "Answer this Olympic trivia question that NOBODY knows",
      data: {
        question: "Which country won the bronze medal in team handball at the 1980 Moscow Olympics?",
        options: ["Romania", "Hungary", "East Germany", "Yugoslavia"],
        correctAnswer: "Romania",
      },
    },
  ],
  wrongMath: [
    {
      id: "math-1",
      type: "wrongMath",
      name: "Wrong Math Challenge",
      difficulty: "medium",
      instructions: "Select the WRONG answer to this math problem",
      data: {
        question: "What is 7 × 8?",
        options: ["56", "54", "58", "42"],
        wrongAnswers: ["54", "58", "42"], // All answers except the correct one
      },
    },
    {
      id: "math-2",
      type: "wrongMath",
      name: "Wrong Math Challenge",
      difficulty: "easy",
      instructions: "Select the WRONG answer to this math problem",
      data: {
        question: "What is 12 + 5?",
        options: ["17", "16", "18", "15"],
        wrongAnswers: ["16", "18", "15"], // All answers except the correct one
      },
    },
  ],
  memeQuiz: [
    {
      id: "meme-1",
      type: "memeQuiz",
      name: "Meme Quiz",
      difficulty: "medium",
      instructions: "Complete this famous meme phrase",
      data: {
        setup: "One does not simply...",
        options: ["walk into Mordor", "become a meme", "finish a CAPTCHA", "understand this reference"],
        correctAnswer: "walk into Mordor",
        memeImage: "/placeholder.svg?height=150&width=200",
      },
    },
    {
      id: "meme-2",
      type: "memeQuiz",
      name: "Meme Quiz",
      difficulty: "easy",
      instructions: "Identify this meme character",
      data: {
        memeImage: "/placeholder.svg?height=150&width=200",
        options: ["Doge", "Grumpy Cat", "Success Kid", "Bad Luck Brian"],
        correctAnswer: "Doge",
      },
    },
  ],
  upsideDown: [
    {
      id: "upside-1",
      type: "upsideDown",
      name: "Upside Down Challenge",
      difficulty: "hard",
      instructions: "Type the following text upside down",
      data: {
        textToType: "I am not a robot",
        timeLimit: 20, // seconds
      },
    },
    {
      id: "upside-2",
      type: "upsideDown",
      name: "Upside Down Challenge",
      difficulty: "medium",
      instructions: "Type the following text upside down",
      data: {
        textToType: "Hello world",
        timeLimit: 15, // seconds
      },
    },
  ],
  timing: [
    {
      id: "timing-1",
      type: "timing",
      name: "Timing Challenge",
      difficulty: "medium",
      instructions: "Press the button exactly 5.3 seconds after starting",
      data: {
        targetTime: 5.3, // seconds
        tolerance: 0.3, // seconds
      },
    },
    {
      id: "timing-2",
      type: "timing",
      name: "Timing Challenge",
      difficulty: "hard",
      instructions: "Press the button exactly 7.8 seconds after starting",
      data: {
        targetTime: 7.8, // seconds
        tolerance: 0.2, // seconds
      },
    },
  ],
}

interface UseGigaCaptchaConfigProps {
  enabledChallenges: ChallengeType[]
  difficulty: DifficultyLevel
}

interface UseGigaCaptchaConfigResult {
  challenges: Challenge[]
  isLoading: boolean
  error: string | null
}

export function useGigaCaptchaConfig({
  enabledChallenges,
  difficulty,
}: UseGigaCaptchaConfigProps): UseGigaCaptchaConfigResult {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // In a real production environment, this would fetch from an API
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [enabledChallenges, difficulty])

  const challenges = useMemo(() => {
    try {
      const filteredChallenges: Challenge[] = []

      // Validate inputs
      if (!Array.isArray(enabledChallenges) || enabledChallenges.length === 0) {
        throw new Error("No challenge types enabled")
      }

      enabledChallenges.forEach((challengeType) => {
        const availableChallenges = challengeDatabase[challengeType]

        if (!availableChallenges || availableChallenges.length === 0) {
          console.warn(`No challenges available for type: ${challengeType}`)
          return
        }

        // For the funny version, we don't strictly filter by difficulty
        // Instead, we include all challenges but prioritize the requested difficulty
        const difficultyFiltered =
          difficulty === "medium"
            ? availableChallenges
            : availableChallenges.filter((c) => c.difficulty === difficulty).length > 0
              ? availableChallenges.filter((c) => c.difficulty === difficulty)
              : availableChallenges

        filteredChallenges.push(...difficultyFiltered)
      })

      if (filteredChallenges.length === 0) {
        throw new Error("No challenges match the selected criteria")
      }

      return filteredChallenges
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load challenges"
      setError(errorMessage)
      return []
    }
  }, [enabledChallenges, difficulty])

  return { challenges, isLoading, error }
}
