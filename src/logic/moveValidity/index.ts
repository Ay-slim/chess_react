import { BoardState, MoveHistoryType, PieceValidityTypes, PlayerColor } from "../../types";

import { default as corePawnValidity } from './pawn'
import { default as pawnValidity } from './pawnAug'
import { default as knightValidity } from './knight'
import { default as rookValidity } from './rook'
import { default as bishopValidity } from './bishop'
import { default as queenValidity } from './queen'
import { default as kingValidity } from './kingAug'
import { default as coreKingValidity } from './king'

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, gameMoves: MoveHistoryType[], pieceName: string) => {

  const validityMap = {
    n: knightValidity,
    r: rookValidity,
    b: bishopValidity,
    q: queenValidity,
  }

  if (pieceName === 'p') {
    return pawnValidity(srcSquareId, color, boardState, gameMoves).includes(destSquareId);
  } else if (pieceName === 'k') {
    return kingValidity(srcSquareId, color, boardState, destSquareId, gameMoves).includes(destSquareId);
  } else {
    return validityMap[pieceName as PieceValidityTypes](srcSquareId, color, boardState).includes(destSquareId);
  }
}

export const allThreatenedSquares = (color: PlayerColor, boardState: BoardState) => {

  type PieceNameType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
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