import { BoardNumbers, BoardState, PlayerColor } from "../types";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "./utils";

export const evaluateKingInCheck = (kingSquare: string, boardState: BoardState, color: PlayerColor) => {
  const [xCoord, yCoord] = boardState[kingSquare].loc
  const kingSurroundingDirections = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
  const knightDirections = [[-2, -1], [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1]]
  const checkedSquaresAndAttackers: {[key: string]: string[]} = {}
  for (const dir of kingSurroundingDirections) {
    const ROOK_DIR = (dir[0] === 0 && [-1, 1].includes(dir[1])) || (dir[1] === 0 && [-1, 1].includes(dir[0]))
    const BISHOP_DIR = (dir[0] === 1 && [-1, 1].includes(dir[1])) || (dir[1] === 1 && [-1, 1].includes(dir[0]))
    const PAWN_DIR = dir[1] === 1 && [-1, 1].includes(dir[0])
    const squaresAlongTheline: string[] = []
    for (let i = 1; i < 8; i++) {
      const targXCoord = normalizedArithmetic(color, 'sum', xCoord, i * dir[0])
      const targYCoord = normalizedArithmetic(color, 'sum', yCoord, i * dir[1])
      if (isValidBoardCoordinates(targXCoord, targYCoord)) {
        const currentSquare = INVERTED_SQUARES[`${targXCoord as BoardNumbers},${targYCoord as BoardNumbers}`]
        const currentPiece = boardState[currentSquare].piece
        if (currentPiece) {
          if (currentPiece[0] !== color && ['b', 'q', 'p', 'r'].includes(currentPiece[1])) {
            if (currentPiece[1] === 'p') {
              if (i === 1 && PAWN_DIR){
                checkedSquaresAndAttackers[currentSquare] = []
                break
              } else {
                break
              }
            }
            if (BISHOP_DIR && ['b', 'q'].includes(currentPiece[1])) {
              checkedSquaresAndAttackers[currentSquare] = squaresAlongTheline
              break
            }
            if (ROOK_DIR && ['r', 'q'].includes(currentPiece[1])) {
              checkedSquaresAndAttackers[currentSquare] = squaresAlongTheline
              break
            }
          } else {
            break
          }
        } else {
          squaresAlongTheline.push(currentSquare)
          continue
        }
      } else {
        break
      }
    }
  }
  for (const knightDir of knightDirections) {
    const targXCoordN = normalizedArithmetic(color, 'sum', xCoord, knightDir[0])
    const targYCoordN = normalizedArithmetic(color, 'sum', yCoord, knightDir[1])
    if (isValidBoardCoordinates(targXCoordN, targYCoordN)) {
      const currentSquareN = INVERTED_SQUARES[`${targXCoordN as BoardNumbers},${targYCoordN as BoardNumbers}`]
      const currentPieceN = boardState[currentSquareN].piece
      if (currentPieceN && currentPieceN[0] !== color && currentPieceN[1] === 'n') {
        checkedSquaresAndAttackers[currentSquareN] = []
      }
    }
  }
  return checkedSquaresAndAttackers
}
