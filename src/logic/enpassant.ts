import { BoardNumbers, BoardState, MoveHistoryType, PlayerColor } from "../types";
import { ENPASSANT_ATTACKING_COLUMNS, ENPASSANT_PAWN_MOVE_DIFF, INVERTED_SQUARES, normalizedArithmetic } from "./utils";

export const isValidEnpassantMove = (srcSquare: string, destSquare: string, currentBoard: BoardState, lastGameMove: MoveHistoryType, currentColor: PlayerColor): boolean => {
  const yCoord = currentBoard[srcSquare]['loc'][1];
  if (yCoord !== ENPASSANT_ATTACKING_COLUMNS[currentColor]) {
    return false;
  }
  const [destXCoord, destYCoord] = currentBoard[destSquare]['loc'];
  const targetYCoord = normalizedArithmetic(currentColor, 'diff', destYCoord, 1);
  const targetSquare = INVERTED_SQUARES[`${destXCoord},${targetYCoord as BoardNumbers}`]
  const targetPiece = currentBoard[targetSquare]['piece'];
  if (!targetPiece) {
    return false;
  }
  if (targetPiece[1] !== 'p' || targetPiece[0] === currentColor) {
    return false;
  }
  if (lastGameMove['destSquare'] !== targetSquare || targetPiece !== lastGameMove['piece']) {
    return false;
  }
  const targetPieceMoveDifference = currentBoard[lastGameMove['destSquare']]['loc'][1] - currentBoard[lastGameMove['srcSquare']]['loc'][1];
  const flippedColor = currentColor === 'w' ? 'b' : 'w';
  if (targetPieceMoveDifference !== ENPASSANT_PAWN_MOVE_DIFF[flippedColor]) {
    return false;
  }
  return true;
}