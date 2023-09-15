import { BoardNumbers, BoardState, MoveHistoryType, PlayerColor } from "../../types"
import { isValidEnpassantMove } from "../enpassant";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState, gameMoves: MoveHistoryType[], allThreatenedSquares: boolean = false): string[] => {
  const pawnThreats: string[] = [];
  const [x_coord, y_coord] = boardState[squareId].loc;
  const topRightXCoord = normalizedArithmetic(color, 'sum', x_coord, 1);
  const topRightYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  const topLeftXCoord = normalizedArithmetic(color, 'diff', x_coord, 1);
  const topLeftYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  if(isValidBoardCoordinates(topRightXCoord, topRightYCoord)) {
    const targetRightSquareId = INVERTED_SQUARES[`${topRightXCoord as BoardNumbers},${topRightYCoord as BoardNumbers}`];
    const targetRightPiece = boardState[targetRightSquareId]['piece'];
    if ((targetRightPiece && targetRightPiece[0] !== color) || isValidEnpassantMove(squareId, targetRightSquareId, boardState, gameMoves[gameMoves.length - 1], color) || allThreatenedSquares) {
      pawnThreats.push(targetRightSquareId);
    }
  }
  if(isValidBoardCoordinates(topLeftXCoord, topLeftYCoord)) {
    const targetLeftSquareId = INVERTED_SQUARES[`${topLeftXCoord as BoardNumbers},${topLeftYCoord as BoardNumbers}`];
    const targetLeftPiece = boardState[targetLeftSquareId]['piece'];
    if ((targetLeftPiece && targetLeftPiece[0] !== color)  || isValidEnpassantMove(squareId, targetLeftSquareId, boardState, gameMoves[gameMoves.length - 1], color) || allThreatenedSquares) {
      pawnThreats.push(targetLeftSquareId);
    }
  }
  return pawnThreats
}

export default validSquares;
