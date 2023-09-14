import { BoardState, MoveHistoryType, PieceValidityTypes, PlayerColor } from "../../types";

import { default as pawnValidity } from './pawn'
import { default as knightValidity } from './knight'
import { default as rookValidity } from './rook'
import { default as bishopValidity } from './bishop'
import { default as queenValidity } from './queen'

const validityMap = {
  n: knightValidity,
  r: rookValidity,
  b: bishopValidity,
  q: queenValidity,
}

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, lastGameMove: MoveHistoryType, pieceName: string) => {
  if (pieceName === 'p') {
    return pawnValidity(srcSquareId, color, boardState, lastGameMove).includes(destSquareId);
  } else {
    return validityMap[pieceName as PieceValidityTypes](srcSquareId, color, boardState).includes(destSquareId);
  }
}