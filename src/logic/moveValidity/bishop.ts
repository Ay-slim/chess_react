import { BoardNumbers, BoardState, PlayerColor } from "../../types"
import { INVERTED_SQUARES, isValidBoardCoordinates, normalizedArithmetic } from "../utils";

const validSquares = (squareId: string, color: PlayerColor, boardState: BoardState, allThreatenedSquares: boolean = false): string[] => {
  const bishopThreats: string[] = [];
  const [xCoord, yCoord] = boardState[squareId].loc;

  //Compute all allowed squares across the 4 diagonal directions the rook can move
  
  //1:15 direction
  for (let dzUpRight = 1; dzUpRight < 8; dzUpRight++) {
    const xCoordUpRight = normalizedArithmetic(color, 'sum', xCoord, dzUpRight);
    const yCoordUpRight = normalizedArithmetic(color, 'sum', yCoord, dzUpRight);
    if (!isValidBoardCoordinates(xCoordUpRight, yCoordUpRight)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoordUpRight as BoardNumbers},${yCoordUpRight as BoardNumbers}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      //Empty square, Rook can move there, the quest continues
      bishopThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      //Same color piece, can't move there, also no need to continue down this path. Our watch is ended
      if (allThreatenedSquares) {
        //We are interested in getting all the squares this piece attacks or protects, so color doesn't matter here. All lives matter, or so they say
        bishopThreats.push(targetSquare)
      }
      break;
    }
    if (targetPiece[0] !== color) {
      //Enemy piece, Rook can capture, and no need to keep checking down this path. Our watch is ended
      bishopThreats.push(targetSquare);
      break;
    }
  }

  //4:15 direction
  for (let dzDownRight = 1; dzDownRight < 8; dzDownRight++) {
    const xCoordDownRight = normalizedArithmetic(color, 'sum', xCoord, dzDownRight);
    const yCoordDownRight = normalizedArithmetic(color, 'diff', yCoord, dzDownRight);
    if (!isValidBoardCoordinates(xCoordDownRight, yCoordDownRight)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoordDownRight as BoardNumbers},${yCoordDownRight as BoardNumbers}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      //Empty square, Rook can move there, the quest continues
      bishopThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      //Same color piece, can't move there, also no need to continue down this path. Our watch is ended
      if (allThreatenedSquares) {
        //We are interested in getting all the squares this piece attacks or protects, so color doesn't matter here. All lives matter, or so they say
        bishopThreats.push(targetSquare)
      }
      break;
    }
    if (targetPiece[0] !== color) {
      //Enemy piece, Rook can capture, and no need to keep checking down this path. Our watch is ended
      bishopThreats.push(targetSquare);
      break;
    }
  }

  //10:15 direction
  for (let dzUpLeft = 1; dzUpLeft < 8; dzUpLeft++) {
    const xCoordUpLeft = normalizedArithmetic(color, 'diff', xCoord, dzUpLeft);
    const yCoordUpLeft = normalizedArithmetic(color, 'sum', yCoord, dzUpLeft);
    if (!isValidBoardCoordinates(xCoordUpLeft, yCoordUpLeft)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoordUpLeft as BoardNumbers},${yCoordUpLeft as BoardNumbers}`]
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      //Empty square, Rook can move there, the quest continues
      bishopThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      //Same color piece, can't move there, also no need to continue down this path. Our watch is ended
      if (allThreatenedSquares) {
        //We are interested in getting all the squares this piece attacks or protects, so color doesn't matter here. All lives matter, or so they say
        bishopThreats.push(targetSquare)
      }
      break;
    }
    if (targetPiece[0] !== color) {
      //Enemy piece, Rook can capture, and no need to keep checking down this path. Our watch is ended
      bishopThreats.push(targetSquare);
      break;
    }
  }

  //7:15 direction
  for (let dzDownLeft = 1; dzDownLeft < 8; dzDownLeft++) {
    const xCoordDownLeft = normalizedArithmetic(color, 'diff', xCoord, dzDownLeft);
    const yCoordDownLeft = normalizedArithmetic(color, 'diff', yCoord, dzDownLeft);
    if (!isValidBoardCoordinates(xCoordDownLeft, yCoordDownLeft)) {
      break;
    }
    const targetSquare = INVERTED_SQUARES[`${xCoordDownLeft as BoardNumbers},${yCoordDownLeft as BoardNumbers}`];
    const targetPiece = boardState[targetSquare].piece;
    if(!targetPiece) {
      bishopThreats.push(targetSquare);
      continue;
    }
    if (targetPiece[0] === color) {
      if (allThreatenedSquares) {
        //We are interested in getting all the squares this piece attacks or protects, so color doesn't matter here. All lives matter, or so they say
        bishopThreats.push(targetSquare)
      }
      break;
    }
    if (targetPiece[0] !== color) {
      bishopThreats.push(targetSquare);
      break;
    }
  }

  return bishopThreats;
}

export default validSquares