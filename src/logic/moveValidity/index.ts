import { BoardState, MoveHistoryType, PlayerColor } from "../../types";

import {default as pawnValidity} from './pawn'

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, lastGameMove: MoveHistoryType, pieceColor: string) => {
  if (pieceColor === 'p') {
    return pawnValidity(srcSquareId, color, boardState, lastGameMove).includes(destSquareId);
  }
}