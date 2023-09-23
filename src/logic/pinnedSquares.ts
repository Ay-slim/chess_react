import { BoardNumbers, BoardState, PlayerColor } from "../types";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "./utils";
import { default as pawnForwardSquares } from './moveValidity/pawnForwardSquares'

const pinnedSquares = (kingSquare: string, boardState: BoardState, color: PlayerColor) => {
  const [xCoord, yCoord] = boardState[kingSquare].loc
  const validKingMoveDirections = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
  const pinnedSquaresAndMoves: {[key: string]: {piece: string, validSquares: string[]}} = {}
  for (const dir of validKingMoveDirections) {
    let kingDefenderEncountered = false
    let pinnedSquare = ''
    let pinnedPiece = ''
    const restrictedValidMoveSquares = [] //Even when pinned, pieces like bishop, rook, queen, can still move along a restricted axis, this array holds those valid squares
    for (let i = 1; i < 8; i++) {
      const targXCoord = normalizedArithmetic(color, 'sum', xCoord, i * dir[0])
      const targYCoord = normalizedArithmetic(color, 'sum', yCoord, i * dir[1])
      if (isValidBoardCoordinates(targXCoord, targYCoord)) {
        const currentSquare = INVERTED_SQUARES[`${targXCoord as BoardNumbers},${targYCoord as BoardNumbers}`]
        const currentPiece = boardState[currentSquare].piece
        if (!currentPiece) {
          restrictedValidMoveSquares.push(currentSquare)
          continue
        }
        if (currentPiece && currentPiece[0] === color && !kingDefenderEncountered) {
          kingDefenderEncountered = true
          pinnedSquare = currentSquare
          pinnedPiece = currentPiece
          continue
        }
        if (currentPiece && currentPiece[0] === color && kingDefenderEncountered) {
          break
        }
        if (currentPiece && currentPiece[0] !== color && kingDefenderEncountered) {
          if (['r', 'b', 'q'].includes(currentPiece[1])) {
            if (['b', 'r', 'q'].includes(pinnedPiece[1])) {
              restrictedValidMoveSquares.push(currentSquare)
            }
            const validMovesArray = ['b', 'r', 'q'].includes(pinnedPiece[1]) ? restrictedValidMoveSquares : pinnedPiece[1] === 'p' ? pawnForwardSquares(boardState, pinnedSquare, color) : []
            pinnedSquaresAndMoves[pinnedSquare] = { piece: pinnedPiece, validSquares: validMovesArray }
          }
          break
        }
      } else {
        break
      }
    }
  }
  return pinnedSquaresAndMoves
}

export default pinnedSquares