import { default as bishopValidity } from './bishop'
import { default as rookValidity } from './rook'
import { BoardState, PlayerColor } from "../../types"

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState): string[] => {
  const bishopThreats: string[] = bishopValidity(squareId, color, boardState);
  const rookThreats: string[] = rookValidity(squareId, color, boardState);
  return bishopThreats.concat(rookThreats);
}

export default validSquares;