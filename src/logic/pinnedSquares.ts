import { BoardNumbers, BoardState, PlayerColor } from "../types";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "./utils";
import { default as pawnForwardSquares } from './moveValidity/pawnForwardSquares'

//POTENTIAL OPTIMIZATION: Instead of starting out from the king and finding all pinned pieces, how about taking just the square that the player intends to move,
//then scan around it to see if it is on a direct line to the king, then track back to find the 'pinner'. For some reason I suspect
//the current method is going to be faster (the king starts out at the edge of the board, so less squares to scan), will need to run time benchmark tests to be sure
const pinnedSquares = (kingSquare: string, boardState: BoardState, color: PlayerColor) => {
  const [xCoord, yCoord] = boardState[kingSquare].loc
  const validKingMoveDirections = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
  const pinnedSquaresAndMoves: {[key: string]: {piece: string, validSquares: string[]}} = {}
  for (const dir of validKingMoveDirections) {
    let kingDefenderEncountered = false
    let pinnedSquare = ''
    let pinnedPiece = ''
    const ROOK_DIR = (dir[0] === 0 && [-1, 1].includes(dir[1])) || (dir[1] === 0 && [-1, 1].includes(dir[0]))
    const BISHOP_DIR = (dir[0] === 1 && [-1, 1].includes(dir[1])) || (dir[1] === 1 && [-1, 1].includes(dir[0]))
    const restrictedValidMoveSquares = [] //Even when pinned, pieces like bishop, rook, queen, and pawn can still move along a restricted axis, this array holds those valid squares
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
        if (currentPiece && currentPiece[0] !== color && !kingDefenderEncountered) {
          break
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
          const pinnedPieceName = pinnedPiece[1]
          const currentPieceName = currentPiece[1]
          if (['r', 'b', 'q'].includes(currentPiece[1])) {
            if (['b', 'r', 'q'].includes(pinnedPiece[1])) {
              restrictedValidMoveSquares.push(currentSquare)
            }
            let validMovesArr: string[] = []
            if (['b', 'r', 'q'].includes(pinnedPieceName)) {
              if (['b', 'q'].includes(pinnedPieceName) && BISHOP_DIR) {
                validMovesArr = restrictedValidMoveSquares
              }
              if (['r', 'q'].includes(pinnedPieceName) && ROOK_DIR) {
                validMovesArr = restrictedValidMoveSquares
              }
            }
            if (pinnedPieceName === 'p') {
              if (dir[0] === 0 && dir[1] === 1) {
                validMovesArr = pawnForwardSquares(boardState, pinnedSquare, color)
              }
              if (dir[1] === 1 && [-1, 1].includes(dir[0])) {
                validMovesArr = [currentSquare]
              }
            }
            if ((['b', 'q'].includes(currentPieceName) && BISHOP_DIR) || (['r', 'q'].includes(currentPieceName) && ROOK_DIR)) {
              pinnedSquaresAndMoves[pinnedSquare] = { piece: pinnedPiece, validSquares: validMovesArr }
            }
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