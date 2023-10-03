import { BoardState, MoveHistoryType, OccupiedSquaresType, PlayerColor } from "../../types";
import { castlingCheck } from "../castling";
import { CASTLING_ROOKS_DICT } from "../utils";
import { default as kingValidSquares } from './king'
import { allThreatenedSquares } from ".";

const allValidKingSquares = (squareId: string, color: PlayerColor, boardState: BoardState, gameMoves: MoveHistoryType[], occupiedSquares: OccupiedSquaresType) => {
  const allSquaresUnderAttack = allThreatenedSquares(color, boardState, occupiedSquares)
  const targetCastlingSquares = []
  for (const xDiff of [2, -2]) {
    const castlingDirection = xDiff === 2 ? '+ve' : '-ve';
    const rookToCastleWith = CASTLING_ROOKS_DICT[`${color}${castlingDirection}`];
    const movedPieces = gameMoves.map((move) => move.piece);
    const kingOrRookAlreadyMoved = movedPieces.includes(`${color}k`) || movedPieces.includes(rookToCastleWith);
    if (kingOrRookAlreadyMoved) {
      continue
    }
    const targetCastlingSquare = castlingCheck(color, castlingDirection, boardState, allSquaresUnderAttack)
    if (targetCastlingSquare) {
      targetCastlingSquares.push(targetCastlingSquare)
    }
  }
  const kingsSquares = kingValidSquares(squareId, color, boardState)
  const allKingsSquares = targetCastlingSquares.length ? targetCastlingSquares.concat(kingsSquares) : kingsSquares
  const filteredKSquares = allKingsSquares.filter(square => !allSquaresUnderAttack.includes(square))
  return filteredKSquares
}

export default allValidKingSquares;