import { BoardNumbers, BoardState, PlayerColor } from "../types";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "./utils";

const pinnedSquares = (kingSquare: string, boardState: BoardState, color: PlayerColor) => {
  const [xCoord, yCoord] = boardState[kingSquare].loc
  const validKingMoveDirections = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
  const pinnedSquares: string[] = []
  for (const dir of validKingMoveDirections) {
    let kingDefenderEncountered = false
    let pinnedSquare = ''
    for (let i = 1; i < 8; i++) {
      const targXCoord = normalizedArithmetic(color, 'sum', xCoord, i * dir[0])
      const targYCoord = normalizedArithmetic(color, 'sum', yCoord, i * dir[1])
      if (isValidBoardCoordinates(targXCoord, targYCoord)) {
        const currentSquare = INVERTED_SQUARES[`${targXCoord as BoardNumbers},${targYCoord as BoardNumbers}`]
        const currentPiece = boardState[currentSquare].piece
        if (!currentPiece) {
          continue
        }
        if (currentPiece && currentPiece[0] === color && !kingDefenderEncountered) {
          kingDefenderEncountered = true
          pinnedSquare = currentSquare
          continue
        }
        if (currentPiece && currentPiece[0] === color && kingDefenderEncountered) {
          break
        }
        if (currentPiece && currentPiece[0] !== color && kingDefenderEncountered) {
          if (['r', 'b', 'q'].includes(currentPiece[1])) {
            pinnedSquares.push(pinnedSquare)
          }
          break
        }
      } else {
        break
      }
    }
  }
  return pinnedSquares
}

export default pinnedSquares