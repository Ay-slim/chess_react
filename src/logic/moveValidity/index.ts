import { BoardState, MoveHistoryType, PieceValidityTypes, PlayerColor, PieceNameType, KingCheckType, SourceSquareAndValidMovesType, OccupiedSquaresType } from "../../types";

import { default as corePawnValidity } from './pawn'
import { default as pawnValidity } from './pawnAug'
import { default as knightValidity } from './knight'
import { default as rookValidity } from './rook'
import { default as bishopValidity } from './bishop'
import { default as queenValidity } from './queen'
import { default as kingValidity } from './kingAug'
import { default as coreKingValidity } from './king'


const validityMap = {
  n: knightValidity,
  r: rookValidity,
  b: bishopValidity,
  q: queenValidity,
}

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, kingInCheck: KingCheckType, allValidMoves: SourceSquareAndValidMovesType) => {
  if (kingInCheck.color) {
    const { validCheckMoves } = kingInCheck
    if (validCheckMoves?.[srcSquareId] && validCheckMoves[srcSquareId].includes(destSquareId)) {
      return true
    }
    return false
  }

  if (Object.keys(allValidMoves).includes(srcSquareId) && allValidMoves[srcSquareId].validSquares.includes(destSquareId)) {
    return true
  }

  return false
}

export const allValidMoves = (color: PlayerColor, boardState: BoardState, pinnedSquares: SourceSquareAndValidMovesType, movesHistory: MoveHistoryType[], occupiedSquares: OccupiedSquaresType) => {
  const allValidMovesMap: SourceSquareAndValidMovesType = {}
  const pinnedSquaresArr = Object.keys(pinnedSquares)
  for (let currentSquare of occupiedSquares[color]) {
    const currentPiece = boardState[currentSquare]?.piece
    const currentPieceName = currentPiece[1]
    if (!pinnedSquaresArr.includes(currentSquare)) {
      const validSquares = currentPieceName === 'p' ? pawnValidity(currentSquare, color, boardState, movesHistory[movesHistory.length - 1])
       : currentPieceName === 'k' ? kingValidity(currentSquare, color, boardState, movesHistory) 
       :  validityMap[currentPieceName as PieceValidityTypes](currentSquare, color, boardState)
      allValidMovesMap[currentSquare] = {
        piece: boardState[currentSquare].piece,
        validSquares
      }
    }
  }
  return {...allValidMovesMap, ...pinnedSquares}
}

export const allThreatenedSquares = (color: PlayerColor, boardState: BoardState) => {
  const threatenedSquaresFns = {
    p: corePawnValidity,
    n: knightValidity,
    b: bishopValidity,
    r: rookValidity,
    q: queenValidity,
    k: coreKingValidity,
  }
  let threatenedSquaresArr: string[] = []
  for (const square of Object.keys(boardState)) {
    const piece = boardState[square].piece
    if (piece && piece[0] !== color) {
      const pieceName: PieceNameType = piece[1] as PieceNameType
      const colorArg = color === 'w' ? 'b' : 'w'
      const squaresThreatenedByThisPiece = threatenedSquaresFns[pieceName](square, colorArg, boardState, true)
      threatenedSquaresArr = threatenedSquaresArr.concat(squaresThreatenedByThisPiece)
    }
  }
  return Array.from(new Set(threatenedSquaresArr))
}