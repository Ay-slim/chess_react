import { BoardState, MoveHistoryType, PieceValidityTypes, PlayerColor } from "../../types";

import { default as pawnValidity } from './pawnAug'
import { default as knightValidity } from './knight'
import { default as rookValidity } from './rook'
import { default as bishopValidity } from './bishop'
import { default as queenValidity } from './queen'
import { default as kingValidity } from './kingAug'

const validityMap = {
  n: knightValidity,
  r: rookValidity,
  b: bishopValidity,
  q: queenValidity,
}

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, gameMoves: MoveHistoryType[], pieceName: string) => {
  if (pieceName === 'p') {
    return pawnValidity(srcSquareId, color, boardState, gameMoves).includes(destSquareId);
  } else if (pieceName === 'k') {
    return kingValidity(srcSquareId, color, boardState, destSquareId, gameMoves).includes(destSquareId);
  } else {
    return validityMap[pieceName as PieceValidityTypes](srcSquareId, color, boardState).includes(destSquareId);
  }
}