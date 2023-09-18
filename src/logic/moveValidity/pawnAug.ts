import { BoardNumbers, BoardState, MoveHistoryType, PlayerColor } from "../../types"
import { isValidEnpassantMove } from "../enpassant";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";
import { default as corePawnValidity } from './pawn'

const validPawnSquares = (squareId: string, color: PlayerColor, boardState: BoardState, gameMoves: MoveHistoryType[]): string[] => {
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
    if (isValidEnpassantMove(squareId, targetRightSquareId, boardState, gameMoves[gameMoves.length - 1], color)) {
      pawnThreats.push(targetRightSquareId);
    }
  }
  if(isValidBoardCoordinates(topLeftXCoord, topLeftYCoord)) {
    const targetLeftSquareId = INVERTED_SQUARES[`${topLeftXCoord as BoardNumbers},${topLeftYCoord as BoardNumbers}`];
    if (isValidEnpassantMove(squareId, targetLeftSquareId, boardState, gameMoves[gameMoves.length - 1], color)) {
      pawnThreats.push(targetLeftSquareId);
    }
  }
  const corePawnSquares = corePawnValidity(squareId, color, boardState);
  return pawnThreats.concat(corePawnSquares);
}

export default validPawnSquares;