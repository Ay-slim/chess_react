import { BoardNumbers, BoardState, MoveHistoryType, PlayerColor } from "../../types"
import { isValidEnpassantMove } from "../enpassant";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState, lastGameMove: MoveHistoryType): string[] => {
  const pawnThreats: string[] = [];
  const [x_coord, y_coord] = boardState[squareId].loc;
  const baseRowMap = { w: 1, b: 6 };
  const pawnhasNotMoved = y_coord === baseRowMap[color];
  const firstSquareAheadYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  const secondSquareAheadYCoord = normalizedArithmetic(color, 'sum', y_coord, 2);
  if (isValidBoardCoordinates(x_coord, firstSquareAheadYCoord)) {
    const firstSquareAheadId = INVERTED_SQUARES[`${x_coord},${firstSquareAheadYCoord as BoardNumbers}`];
    const firstSquareAheadPiece = boardState[firstSquareAheadId]['piece'];
    if (!firstSquareAheadPiece) {
      pawnThreats.push(firstSquareAheadId)
    }
    if (isValidBoardCoordinates(x_coord, secondSquareAheadYCoord)) {
      const secondSquareAheadId = INVERTED_SQUARES[`${x_coord},${secondSquareAheadYCoord as BoardNumbers}`];
      const secondSquareAheadPiece = boardState[secondSquareAheadId]['piece'];
      if (pawnhasNotMoved && !secondSquareAheadPiece) {
        pawnThreats.push(secondSquareAheadId)
      }
    }
  }
  const topRightXCoord = normalizedArithmetic(color, 'sum', x_coord, 1);
  const topRightYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  const topLeftXCoord = normalizedArithmetic(color, 'diff', x_coord, 1);
  const topLeftYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  if(isValidBoardCoordinates(topRightXCoord, topRightYCoord)) {
    const targetRightSquareId = INVERTED_SQUARES[`${topRightXCoord as BoardNumbers},${topRightYCoord as BoardNumbers}`];
    const targetRightPiece = boardState[targetRightSquareId]['piece'];
    if ((targetRightPiece && targetRightPiece[0] !== color) || isValidEnpassantMove(squareId, targetRightSquareId, boardState, lastGameMove, color)) {
      pawnThreats.push(targetRightSquareId);
    }
  }
  if(isValidBoardCoordinates(topLeftXCoord, topLeftYCoord)) {
    const targetLeftSquareId = INVERTED_SQUARES[`${topLeftXCoord as BoardNumbers},${topLeftYCoord as BoardNumbers}`];
    const targetLeftPiece = boardState[targetLeftSquareId]['piece'];
    if ((targetLeftPiece && targetLeftPiece[0] !== color)  || isValidEnpassantMove(squareId, targetLeftSquareId, boardState, lastGameMove, color)) {
      pawnThreats.push(targetLeftSquareId);
    }
  }
  return pawnThreats;
}

export default validSquares;
