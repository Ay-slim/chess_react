import { MoveComparisonType, MoveHistoryType } from "../types";
const identicalPositionsCheck = (move1: MoveComparisonType, move2: MoveComparisonType) => {
  for (const square of move1.occupiedSquares) {
    //console.log(!move2.occupiedSquares.includes(square), 'equality', move1.boardState[square].piece, 'first piece', move2.boardState[square].piece, 'second piece')
    if (!move2.occupiedSquares.includes(square) || move1.boardState[square].piece !== move2.boardState[square].piece) {
      return false
    }
  }
  return true
}
export const threefoldRepitition = (movesHistory: MoveHistoryType[]) => {
  const historyLength = movesHistory.length
  const currentOccupiedSquares = [...movesHistory[historyLength - 1].occupiedSquares['w'], ...movesHistory[historyLength - 1].occupiedSquares['b']]
  const middleOccupiedSquares = [...movesHistory[historyLength - 5].occupiedSquares['w'], ...movesHistory[historyLength - 5].occupiedSquares['b']]
  const farthestOccupiedSquares = [...movesHistory[historyLength - 9].occupiedSquares['w'], ...movesHistory[historyLength - 9].occupiedSquares['b']]
  if (!(currentOccupiedSquares.length === middleOccupiedSquares.length && middleOccupiedSquares.length === farthestOccupiedSquares.length)) {
    return false
  }
  const currentMovePacket: MoveComparisonType = { occupiedSquares: currentOccupiedSquares, boardState: movesHistory[historyLength - 1].boardBefore }
  const middleMovePacket: MoveComparisonType = { occupiedSquares: middleOccupiedSquares, boardState: movesHistory[historyLength - 5].boardBefore }
  const farthestMovePacket: MoveComparisonType = { occupiedSquares: farthestOccupiedSquares, boardState: movesHistory[historyLength - 9].boardBefore }

  if (!(identicalPositionsCheck(currentMovePacket, middleMovePacket) && identicalPositionsCheck(middleMovePacket, farthestMovePacket))) {
    return false
  }
  return true
}