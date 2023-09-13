import { BoardState, PlayerColor } from "../../types";

import {default as pawnValidity} from './pawn'
 
const isValidPawnMove = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState) => {
  return pawnValidity(srcSquareId, color, boardState).includes(destSquareId)
}

export const moveValidity =  {
  p: isValidPawnMove,
}