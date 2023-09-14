import { BoardNumbers, BoardState, PlayerColor } from "../../types"
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState): string[] => {
  const rookThreats: string[] = [];
  const [xCoord, yCoord] = boardState[squareId].loc;

  //Compute all allowed squares across the 4 directions the rook can move
  
  //+x direction
  for (let dxRight = 1; dxRight < 8; dxRight++) {
    const xCoordRight = normalizedArithmetic(color, 'sum', xCoord, dxRight)
    if (!isValidBoardCoordinates(xCoordRight, yCoord)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoordRight as BoardNumbers},${yCoord}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      //Empty square, Rook can move there, the quest continues
      rookThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      //Same color piece, can't move there, also no need to continue down this path. Our watch is ended
      break;
    }
    if (targetPiece[0] !== color) {
      //Enemy piece, Rook can capture, and no need to keep checking down this path. Our watch is ended
      rookThreats.push(targetSquare);
      break;
    }
  }

  //-x direction
  for (let dxLeft = 1; dxLeft < 8; dxLeft++) {
    const xCoordLeft = normalizedArithmetic(color, 'diff', xCoord, dxLeft)
    if (!isValidBoardCoordinates(xCoordLeft, yCoord)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoordLeft as BoardNumbers},${yCoord}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      rookThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      break;
    }
    if (targetPiece[0] !== color) {
      rookThreats.push(targetSquare);
      break;
    }
  }

  //+y direction
  for (let dyUp = 1; dyUp < 8; dyUp++) {
    const yCoordUp = normalizedArithmetic(color, 'sum', yCoord, dyUp)
    if (!isValidBoardCoordinates(xCoord, yCoordUp)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoord},${yCoordUp as BoardNumbers}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      rookThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      break;
    }
    if (targetPiece[0] !== color) {
      rookThreats.push(targetSquare);
      break;
    }
  }

  //-y direction
  for (let dyDown = 1; dyDown < 8; dyDown++) {
    const yCoordDown = normalizedArithmetic(color, 'diff', yCoord, dyDown)
    if (!isValidBoardCoordinates(xCoord, yCoordDown)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoord},${yCoordDown as BoardNumbers}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      rookThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      break;
    }
    if (targetPiece[0] !== color) {
      rookThreats.push(targetSquare);
      break;
    }
  }

  return rookThreats;
}

export default validSquares