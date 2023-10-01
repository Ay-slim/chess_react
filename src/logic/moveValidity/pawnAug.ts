import { BoardNumbers, BoardState, MoveHistoryType, PlayerColor } from "../../types"
import { isValidEnpassantMove } from "../enpassant";
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";
import { default as corePawnValidity } from './pawn'
import { default as pawnForwardSquares } from './pawnForwardSquares'

const validPawnSquares = (squareId: string, color: PlayerColor, boardState: BoardState, lastMove: MoveHistoryType): string[] => {
  const pawnThreats: string[] = pawnForwardSquares(boardState, squareId, color)
  const [x_coord, y_coord] = boardState[squareId].loc;
  const topRightXCoord = normalizedArithmetic(color, 'sum', x_coord, 1);
  const topRightYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  const topLeftXCoord = normalizedArithmetic(color, 'diff', x_coord, 1);
  const topLeftYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  if(isValidBoardCoordinates(topRightXCoord, topRightYCoord)) {
    const targetRightSquareId = INVERTED_SQUARES[`${topRightXCoord as BoardNumbers},${topRightYCoord as BoardNumbers}`];
    if (isValidEnpassantMove(squareId, targetRightSquareId, boardState, lastMove, color)) {
      pawnThreats.push(targetRightSquareId);
    }
  }
  if(isValidBoardCoordinates(topLeftXCoord, topLeftYCoord)) {
    const targetLeftSquareId = INVERTED_SQUARES[`${topLeftXCoord as BoardNumbers},${topLeftYCoord as BoardNumbers}`];
    if (isValidEnpassantMove(squareId, targetLeftSquareId, boardState, lastMove, color)) {
      pawnThreats.push(targetLeftSquareId);
    }
  }
  const corePawnSquares = corePawnValidity(squareId, color, boardState);
  return pawnThreats.concat(corePawnSquares);
}

export default validPawnSquares;