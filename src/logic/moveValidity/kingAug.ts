import { BoardState, MoveHistoryType, PlayerColor } from "../../types";
import { castlingCheck } from "../castling";
import { CASTLING_ROOKS_DICT } from "../utils";
import { default as kingValidSquares } from './king'

const allValidKingSquares = (squareId: string, color: PlayerColor, boardState: BoardState, destSquare: string, gameMoves: MoveHistoryType[]) => {
  const xCoord = boardState[squareId].loc[0];
  const xCoordTarget = boardState[destSquare].loc[0];
  const xDiff = xCoordTarget - xCoord;
  if (![2, -2].includes(xDiff)) {
    return []
  }
  const castlingDirection = xDiff === 2 ? '+ve' : '-ve';
  const rookToCastleWith = CASTLING_ROOKS_DICT[`${color}${castlingDirection}`];
  const movedPieces = gameMoves.map((move) => move.piece);
  const kingOrRookAlreadyMoved = movedPieces.includes(`${color}k`) || movedPieces.includes(rookToCastleWith);
  const targetCastlingSquare = castlingCheck(color, castlingDirection, boardState)
  if (kingOrRookAlreadyMoved || !targetCastlingSquare) {
    return []
  }
  const kingsSquares = kingValidSquares(squareId, color, boardState);
  return kingsSquares.concat([targetCastlingSquare]);
}

export default allValidKingSquares;