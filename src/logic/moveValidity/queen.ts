import { default as bishopValidity } from './bishop'
import { default as rookValidity } from './rook'
import { BoardState, PlayerColor } from "../../types"

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState, allThreatenedSquares: boolean = false): string[] => {
  const bishopThreats: string[] = bishopValidity(squareId, color, boardState, allThreatenedSquares);
  const rookThreats: string[] = rookValidity(squareId, color, boardState, allThreatenedSquares);
  return bishopThreats.concat(rookThreats);
}

export default validSquares;