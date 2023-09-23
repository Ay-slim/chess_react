import { BoardNumbers, BoardState, PlayerColor } from "../../types";
import { BASE_ROW_MAP, INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";

const pawnForwardSquares = (boardState: BoardState, squareId: string, color: PlayerColor) => {
  const forwardSquares = []
  const [x_coord, y_coord] = boardState[squareId].loc;
  const pawnhasNotMoved = y_coord === BASE_ROW_MAP[color];
  const firstSquareAheadYCoord = normalizedArithmetic(color, 'sum', y_coord, 1);
  const secondSquareAheadYCoord = normalizedArithmetic(color, 'sum', y_coord, 2);
  if (isValidBoardCoordinates(x_coord, firstSquareAheadYCoord)) {
    const firstSquareAheadId = INVERTED_SQUARES[`${x_coord},${firstSquareAheadYCoord as BoardNumbers}`];
    const firstSquareAheadPiece = boardState[firstSquareAheadId]['piece'];
    if (!firstSquareAheadPiece) {
      forwardSquares.push(firstSquareAheadId)
    }
    if (isValidBoardCoordinates(x_coord, secondSquareAheadYCoord)) {
      const secondSquareAheadId = INVERTED_SQUARES[`${x_coord},${secondSquareAheadYCoord as BoardNumbers}`];
      const secondSquareAheadPiece = boardState[secondSquareAheadId]['piece'];
      if (pawnhasNotMoved && !secondSquareAheadPiece) {
        forwardSquares.push(secondSquareAheadId)
      }
    }
  }
  return forwardSquares
}

export default pawnForwardSquares