import { BoardState, MoveHistoryType, PlayerColor } from "../../types";
import { castlingCheck } from "../castling";
import { CASTLING_ROOKS_DICT } from "../utils";
import { default as kingValidSquares } from './king'
import { allThreatenedSquares } from ".";

const allValidKingSquares = (squareId: string, color: PlayerColor, boardState: BoardState, destSquare: string, gameMoves: MoveHistoryType[]) => {
  const allSquaresUnderAttack = allThreatenedSquares(color, boardState)
  const xCoord = boardState[squareId].loc[0];
  const xCoordTarget = boardState[destSquare].loc[0];
  const xDiff = xCoordTarget - xCoord;
  let targetCastlingSquare = ''
  if ([2, -2].includes(xDiff)) {
    const castlingDirection = xDiff === 2 ? '+ve' : '-ve';
    const rookToCastleWith = CASTLING_ROOKS_DICT[`${color}${castlingDirection}`];
    const movedPieces = gameMoves.map((move) => move.piece);
    const kingOrRookAlreadyMoved = movedPieces.includes(`${color}k`) || movedPieces.includes(rookToCastleWith);
    targetCastlingSquare = kingOrRookAlreadyMoved ? '' : castlingCheck(color, castlingDirection, boardState, allSquaresUnderAttack)
  }
  const kingsSquares = kingValidSquares(squareId, color, boardState)
  const allKingsSquares = targetCastlingSquare ? [targetCastlingSquare].concat(kingsSquares) : kingsSquares
  const filteredKSquares = allKingsSquares.filter(square => !allSquaresUnderAttack.includes(square))
  return filteredKSquares
}

export default allValidKingSquares;