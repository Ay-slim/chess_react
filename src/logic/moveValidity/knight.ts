import { BoardNumbers, BoardState, PlayerColor } from "../../types"
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState): string[] => {
  const knightThreats: string[] = [];
  const [xCoord, yCoord] = boardState[squareId].loc;

  //Compute all allowed squares the knight can move to
  const topNearRightXCoord = normalizedArithmetic(color, 'sum', xCoord, 2);
  const topNearRightYCoord = normalizedArithmetic(color, 'sum', yCoord, 1);
  
  const topFarRightXCoord = normalizedArithmetic(color, 'sum', xCoord, 1);
  const topFarRightYCoord = normalizedArithmetic(color, 'sum', yCoord, 2);
  
  const topNearLeftXCoord = normalizedArithmetic(color, 'diff', xCoord, 2);
  const topNearLeftYCoord = normalizedArithmetic(color, 'sum', yCoord, 1);
  
  const topFarLeftXCoord = normalizedArithmetic(color, 'diff', xCoord, 1);
  const topFarLeftYCoord = normalizedArithmetic(color, 'sum', yCoord, 2);

  const bottomNearRightXCoord = normalizedArithmetic(color, 'sum', xCoord, 2);
  const bottomNearRightYCoord = normalizedArithmetic(color, 'diff', yCoord, 1);
  
  const bottomFarRightXCoord = normalizedArithmetic(color, 'sum', xCoord, 1);
  const bottomFarRightYCoord = normalizedArithmetic(color, 'diff', yCoord, 2);

  const bottomNearLeftXCoord = normalizedArithmetic(color, 'diff', xCoord, 2);
  const bottomNearLeftYCoord = normalizedArithmetic(color, 'diff', yCoord, 1);
  
  const bottomFarLeftXCoord = normalizedArithmetic(color, 'diff', xCoord, 1);
  const bottomFarLeftYCoord = normalizedArithmetic(color, 'diff', yCoord, 2);

  const coordsList = [
    [topNearRightXCoord, topNearRightYCoord],
    [topFarRightXCoord, topFarRightYCoord],
    [topNearLeftXCoord, topNearLeftYCoord],
    [topFarLeftXCoord, topFarLeftYCoord],
    [bottomNearRightXCoord, bottomNearRightYCoord],
    [bottomFarRightXCoord, bottomFarRightYCoord],
    [bottomNearLeftXCoord, bottomNearLeftYCoord],
    [bottomFarLeftXCoord, bottomFarLeftYCoord],
  ];

  for (const j of coordsList) {
    const [targetXCoord, targetYCoord] = j;
    if (isValidBoardCoordinates(targetXCoord, targetYCoord)) {
      const targetSquare = INVERTED_SQUARES[`${targetXCoord as BoardNumbers},${targetYCoord as BoardNumbers}`] //Safe to type cast here because we already confirmed they are valid coordinates above
      const targetPiece = boardState[targetSquare].piece;
      if (!targetPiece || (targetPiece && (targetPiece[0] !== color))) {
        knightThreats.push(targetSquare)
      }
    }
  }
  return knightThreats;
}

export default validSquares