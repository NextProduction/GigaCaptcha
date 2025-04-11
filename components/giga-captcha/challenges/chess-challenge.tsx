"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Chessboard } from "react-chessboard"
import { Chess } from "chess.js"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ChallengeComponentProps } from "../types"

export function ChessChallenge({ challenge, onSuccess, onFailure }: ChallengeComponentProps) {
  const [game, setGame] = useState<Chess | null>(null)
  const [fen, setFen] = useState(challenge.data.fen)
  const [moveFrom, setMoveFrom] = useState("")
  const [moveTo, setMoveTo] = useState<string | null>(null)
  const [showPromotionDialog, setShowPromotionDialog] = useState(false)
  const [rightClickedSquares, setRightClickedSquares] = useState({})
  const [optionSquares, setOptionSquares] = useState({})
  const [moveSquares, setMoveSquares] = useState({})
  const [status, setStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moveCount, setMoveCount] = useState(0)
  const [hint, setHint] = useState(false)

  // Initialize chess game
  useEffect(() => {
    try {
      const newGame = new Chess(challenge.data.fen)
      setGame(newGame)
      setFen(newGame.fen())

      // Set initial status
      updateStatus(newGame)
    } catch (error) {
      console.error("Error initializing chess game:", error)
      setStatus("Error initializing game")
    }
  }, [challenge.data.fen])

  // Update game status
  const updateStatus = useCallback(
    (currentGame: Chess) => {
      let statusText = ""

      if (currentGame.isCheckmate()) {
        statusText = "Game over, checkmate!"

        // Check if the last move matches the correct move
        const history = currentGame.history({ verbose: true })
        const lastMove = history[history.length - 1]

        if (lastMove) {
          const moveNotation = `${lastMove.from}${lastMove.to}`
          if (moveNotation === challenge.data.correctMove) {
            setIsSubmitting(true)
            setTimeout(() => {
              onSuccess()
            }, 1500)
          }
        }
      } else if (currentGame.isDraw()) {
        statusText = "Game over, drawn position"
      } else {
        statusText = currentGame.isCheck() ? "Check!" : `${currentGame.turn() === "w" ? "White" : "Black"} to move`
      }

      setStatus(statusText)
    },
    [challenge.data.correctMove, onSuccess],
  )

  // Handle piece movement
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    if (!game) return false

    try {
      // Check if the move is legal
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Always promote to queen for simplicity
      })

      // If move is illegal, return false
      if (!move) return false

      // Update the game state
      setFen(game.fen())
      setMoveCount((prev) => prev + 1)
      updateStatus(game)

      // Reset selection
      setMoveFrom("")
      setMoveTo(null)
      setOptionSquares({})
      setRightClickedSquares({})

      return true
    } catch (error) {
      console.error("Error making move:", error)
      return false
    }
  }

  // Handle square click
  const onSquareClick = (square: string) => {
    if (!game) return

    // Check if we already have a piece selected
    if (moveFrom === square) {
      // Deselect the piece
      setMoveFrom("")
      setMoveTo(null)
      setOptionSquares({})
      return
    }

    // Try to select a piece
    const piece = game.get(square)
    const hasPiece = piece !== null
    const isPlayersTurn = (game.turn() === "w" && piece?.color === "w") || (game.turn() === "b" && piece?.color === "b")

    if (hasPiece && isPlayersTurn) {
      // Select the piece
      setMoveFrom(square)

      // Show possible moves
      const moves = game.moves({
        square,
        verbose: true,
      })

      const newOptionSquares = {}
      moves.forEach((move) => {
        newOptionSquares[move.to] = {
          background: "rgba(255, 255, 0, 0.4)",
          borderRadius: "50%",
        }
      })
      setOptionSquares(newOptionSquares)
    } else if (moveFrom) {
      // Try to make a move
      const move = game.move({
        from: moveFrom,
        to: square,
        promotion: "q", // Always promote to queen for simplicity
      })

      // If the move is legal, update the game state
      if (move) {
        setFen(game.fen())
        setMoveCount((prev) => prev + 1)
        updateStatus(game)

        // Reset selection
        setMoveFrom("")
        setOptionSquares({})
      } else {
        // Invalid move, keep the piece selected
        setMoveTo(null)
      }
    }
  }

  const handleGiveUp = () => {
    onFailure()
  }

  const showHint = () => {
    setHint(true)

    if (game && challenge.data.correctMove) {
      const from = challenge.data.correctMove.substring(0, 2)
      const to = challenge.data.correctMove.substring(2, 4)

      const hintSquares = {
        [from]: {
          background: "rgba(106, 90, 205, 0.5)",
        },
        [to]: {
          background: "rgba(106, 90, 205, 0.5)",
          borderRadius: "50%",
        },
      }

      setOptionSquares(hintSquares)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {game && (
          <div className="w-full max-w-[350px]">
            <Chessboard
              id="GigaCaptchaChess"
              position={fen}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={{
                ...optionSquares,
                ...moveSquares,
                ...rightClickedSquares,
              }}
              boardWidth={350}
              areArrowsAllowed={true}
            />
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium">{status}</p>
        {isSubmitting && (
          <Alert className="mt-2 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Checkmate!</AlertTitle>
            <AlertDescription>You found the winning move! Well done.</AlertDescription>
          </Alert>
        )}
        {hint && !isSubmitting && (
          <Alert className="mt-2 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle>Hint</AlertTitle>
            <AlertDescription>
              Look for a checkmate in one move. The highlighted squares show the piece to move and where to move it.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={handleGiveUp}>
          Give Up
        </Button>
        <Button variant="outline" size="sm" onClick={showHint} disabled={hint || isSubmitting}>
          Show Hint
        </Button>
      </div>
    </div>
  )
}
