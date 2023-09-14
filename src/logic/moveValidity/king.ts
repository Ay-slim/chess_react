import { BoardNumbers, BoardState, PlayerColor } from "../../types"
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";
//TO-DO: Pass down threatened squares and filter them out as well (check python implementation for reference)
const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState): string[] => {
  const kingThreats: string[] = [];
  const [xCoord, yCoord] = boardState[squareId].loc;
  const targetCoords: [number, number][] = [
    [xCoord, normalizedArithmetic(color, 'sum', yCoord, 1)],
    [normalizedArithmetic(color, 'sum', xCoord, 1), normalizedArithmetic(color, 'sum', yCoord, 1)],
    [normalizedArithmetic(color, 'sum', xCoord, 1), yCoord],
    [normalizedArithmetic(color, 'sum', xCoord, 1), normalizedArithmetic(color, 'diff', yCoord, 1)],
    [xCoord, normalizedArithmetic(color, 'diff', yCoord, 1)],
    [normalizedArithmetic(color, 'diff', xCoord, 1), normalizedArithmetic(color, 'diff', yCoord, 1)],
    [normalizedArithmetic(color, 'diff', xCoord, 1), yCoord],
    [normalizedArithmetic(color, 'diff', xCoord, 1), normalizedArithmetic(color, 'sum', yCoord, 1)]
  ]
  for (const j of targetCoords) {
    const [targetXCoord, targetYCoord] = j;
    if (isValidBoardCoordinates(targetXCoord, targetYCoord)) {
      const targetSquare = INVERTED_SQUARES[`${targetXCoord as BoardNumbers},${targetYCoord as BoardNumbers}`] //Safe to type cast here because we already confirmed they are valid coordinates above
      const targetPiece = boardState[targetSquare].piece;
      if (!targetPiece || (targetPiece && (targetPiece[0] !== color))) {
        kingThreats.push(targetSquare)
      }
    }
  }
  return kingThreats;
}
export default validSquares;