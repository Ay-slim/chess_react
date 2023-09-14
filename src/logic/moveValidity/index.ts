import { BoardState, MoveHistoryType, PieceValidityTypes, PlayerColor } from "../../types";

import {default as pawnValidity} from './pawn'
import {default as knightValidity} from './knight'

const validityMap = {
  n: knightValidity,
}

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, lastGameMove: MoveHistoryType, pieceName: string) => {
  if (pieceName === 'p') {
    return pawnValidity(srcSquareId, color, boardState, lastGameMove).includes(destSquareId);
  } else {
    return validityMap[pieceName as PieceValidityTypes](srcSquareId, color, boardState).includes(destSquareId);
  }
}