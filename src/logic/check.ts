import { BoardNumbers, BoardState, OccupiedSquaresType, PlayerColor } from "../types";
import { allThreatenedSquares } from "./moveValidity";
import pinnedSquares from "./pinnedSquares";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "./utils";

export const evaluateKingInCheck = (kingSquare: string, boardState: BoardState, color: PlayerColor) => {
  const [xCoord, yCoord] = boardState[kingSquare].loc
  const kingSurroundingDirections = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
  const knightDirections = [[-2, -1], [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1]]
  const checkedSquaresAndAttackers: {[key: string]: string[]} = {}//The key of this object is the square of the attacking piece responsible for the check. The value is an array of the empty squares between the attacker and the king in check
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

const piecesAttackingMe = (squareId: string, boardState: BoardState, color: PlayerColor) => {
  const [xCoord, yCoord] = boardState[squareId].loc
  const SURROUNDING_DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]
  const KNIGHT_DIRECTIONS = [[-2, -1], [-1, -2], [1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1]]
  const myAttackers = []
  for (const dir of SURROUNDING_DIRECTIONS) {
    const ROOK_DIR = (dir[0] === 0 && [-1, 1].includes(dir[1])) || (dir[1] === 0 && [-1, 1].includes(dir[0]))
    const BISHOP_DIR = (dir[0] === 1 && [-1, 1].includes(dir[1])) || (dir[1] === 1 && [-1, 1].includes(dir[0]))
    const PAWN_CAPTURE_DIR = dir[1] === 1 && [-1, 1].includes(dir[0])
    const PAWN_BLOCK_DIR = dir[1] === 1 && dir[0] === 0
    for (let i = 1; i < 8; i++) {
      const targXCoord = normalizedArithmetic(color, 'sum', xCoord, i * dir[0])
      const targYCoord = normalizedArithmetic(color, 'sum', yCoord, i * dir[1])
      if (isValidBoardCoordinates(targXCoord, targYCoord)) {
        const currentSquare = INVERTED_SQUARES[`${targXCoord as BoardNumbers},${targYCoord as BoardNumbers}`]
        const currentPiece = boardState[currentSquare].piece
        if (currentPiece) {
          const pieceName = currentPiece[1]
          if (currentPiece[0] !== color && ['b', 'q', 'p', 'r'].includes(pieceName)) {
            if (pieceName === 'p' && [1, 2].includes(i)) {
              if (i === 1) {
                const pieceOnSquareToBlockOrCapture = boardState[squareId].piece
                if ((pieceOnSquareToBlockOrCapture && PAWN_CAPTURE_DIR) || (!pieceOnSquareToBlockOrCapture && PAWN_BLOCK_DIR)) {
                  myAttackers.push(currentSquare)
                  break
                }
              break
              } else {
                const homePawn = (currentPiece[0] === 'b' && Number(currentSquare[1]) === 7) || (currentPiece[0] === 'w' && Number(currentSquare[1]) === 2)
                if (homePawn && PAWN_BLOCK_DIR) {
                  myAttackers.push(currentSquare)
                  break
                }
              }
              break
            }
            if (BISHOP_DIR && ['b', 'q'].includes(pieceName)) {
              myAttackers.push(currentSquare)
              break
            }
            if (ROOK_DIR && ['r', 'q'].includes(pieceName)) {
              myAttackers.push(currentSquare)
              break
            }
          } else {
            break
          }
        } else {
          continue
        }
      } else {
        break
      }
    }
  }
  for (const knightDir of KNIGHT_DIRECTIONS) {
    const targXCoordN = normalizedArithmetic(color, 'sum', xCoord, knightDir[0])
    const targYCoordN = normalizedArithmetic(color, 'sum', yCoord, knightDir[1])
    if (isValidBoardCoordinates(targXCoordN, targYCoordN)) {
      const currentSquareN = INVERTED_SQUARES[`${targXCoordN as BoardNumbers},${targYCoordN as BoardNumbers}`]
      const currentPieceN = boardState[currentSquareN].piece
      if (currentPieceN && currentPieceN[0] !== color && currentPieceN[1] === 'n') {
        myAttackers.push(currentSquareN)
      }
    }
  }
  return myAttackers
}

export const validMovesWhenInCheck = (color: PlayerColor, checkedSquaresAndAttackers: {[key: string]: string[]}, boardState: BoardState, kingSquare: string, occupiedSquares: OccupiedSquaresType) => {
  const pinnedSquaresMap = pinnedSquares(kingSquare, boardState, color)
  const pinnedSquareVals = Object.keys(pinnedSquaresMap)
  const validMoves: {[key: string]: string[]} = {} //Key is the source square of any movable pieces, value is an array of their allowed destination square(s)
  const opponentColor = color === 'w' ? 'b' : 'w'
  //Three things can occur when in check: 1/ Capture attacking piece, 2/ Block check by placing a piece btw king and attacker. 3/Move king to a safe square
  //1 and 2 above can only be achieved if there's only one piece attacking the king, hence the if condition below.
  if (Object.keys(checkedSquaresAndAttackers).length === 1) {
    //The checkedSquaresAndAttackers object has the attacking piece as its key and a list of empty squares between said attacking piece and the king being checked as the value...
    //...in the context of the piecesAttackingMe function, there's no difference between the attacking piece's square and the empty squares to the king to be blocked. All we care about...
    //...is getting an opposing (and unpinned) piece to either capture the attacker or block the check, so we'll concatenate the keys and values, then apply the function to them all.
    const attackingPieceSquare = Object.keys(checkedSquaresAndAttackers)[0]
    const attackingSquareAndSquaresToBlock = [attackingPieceSquare, ...checkedSquaresAndAttackers[attackingPieceSquare]]
    attackingSquareAndSquaresToBlock.forEach(intendedSquare => {
      const squaresThatCanCaptureOrBlock = piecesAttackingMe(intendedSquare, boardState, opponentColor)
      if (squaresThatCanCaptureOrBlock.length) {
        squaresThatCanCaptureOrBlock.forEach(square => {
          if (!pinnedSquareVals.includes(square) || (pinnedSquareVals.includes(square) && pinnedSquaresMap[square].validSquares.includes(intendedSquare))) {
            //validMoves[square] = intendedSquare
            validMoves[square] = validMoves?.[square] ? validMoves[square].concat([intendedSquare]) : [intendedSquare]
          }
        })
      }
    })
  }

  const squaresForbiddenForKing = allThreatenedSquares(color, boardState, occupiedSquares)
  const SURROUNDING_DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]

  for (const dir of SURROUNDING_DIRECTIONS) {
    const [xCoord, yCoord] = boardState[kingSquare].loc
    const targXCoord = normalizedArithmetic(color, 'sum', xCoord, dir[0])
    const targYCoord = normalizedArithmetic(color, 'sum', yCoord, dir[1])
    if (isValidBoardCoordinates(targXCoord, targYCoord)) {
      const currentSquare = INVERTED_SQUARES[`${targXCoord as BoardNumbers},${targYCoord as BoardNumbers}`]
      const currentPiece = boardState[currentSquare].piece
      if ((!currentPiece || currentPiece[0] !== color) && !squaresForbiddenForKing.includes(currentSquare)) {
        validMoves[kingSquare] = validMoves?.[kingSquare] ? validMoves[kingSquare].concat([currentSquare]) : [currentSquare]
      }
    }
  }
  return validMoves
}