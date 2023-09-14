import { BoardState, MoveHistoryType, PlayerColor } from "../../types";

import {default as pawnValidity} from './pawn'
 
const isValidPawnMove = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, lastGameMove: MoveHistoryType) => {
  return pawnValidity(srcSquareId, color, boardState, lastGameMove).includes(destSquareId);
}

export const moveValidity =  {
  p: isValidPawnMove,
}