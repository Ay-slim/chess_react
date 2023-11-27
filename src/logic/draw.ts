import {
  BoardState,
  MoveComparisonType,
  MoveHistoryType,
  OccupiedSquaresType,
  SourceSquareAndValidMovesType,
} from '../types'
const identicalPositionsCheck = (
  move1: MoveComparisonType,
  move2: MoveComparisonType
) => {
  for (const square of move1.occupiedSquares) {
    //console.log(!move2.occupiedSquares.includes(square), 'equality', move1.boardState[square].piece, 'first piece', move2.boardState[square].piece, 'second piece')
    if (
      !move2.occupiedSquares.includes(square) ||
      move1.boardState[square].piece !== move2.boardState[square].piece
    ) {
      return false
    }
  }
  return true
}
const threefoldRepitition = (movesHistory: MoveHistoryType[]) => {
  const historyLength = movesHistory.length
  const currentOccupiedSquares = [
    ...movesHistory[historyLength - 1].occupiedSquares['w'],
    ...movesHistory[historyLength - 1].occupiedSquares['b'],
  ]
  const middleOccupiedSquares = [
    ...movesHistory[historyLength - 5].occupiedSquares['w'],
    ...movesHistory[historyLength - 5].occupiedSquares['b'],
  ]
  const farthestOccupiedSquares = [
    ...movesHistory[historyLength - 9].occupiedSquares['w'],
    ...movesHistory[historyLength - 9].occupiedSquares['b'],
  ]
  if (
    !(
      currentOccupiedSquares.length === middleOccupiedSquares.length &&
      middleOccupiedSquares.length === farthestOccupiedSquares.length
    )
  ) {
    return false
  }
  const currentMovePacket: MoveComparisonType = {
    occupiedSquares: currentOccupiedSquares,
    boardState: movesHistory[historyLength - 1].boardBefore,
  }
  const middleMovePacket: MoveComparisonType = {
    occupiedSquares: middleOccupiedSquares,
    boardState: movesHistory[historyLength - 5].boardBefore,
  }
  const farthestMovePacket: MoveComparisonType = {
    occupiedSquares: farthestOccupiedSquares,
    boardState: movesHistory[historyLength - 9].boardBefore,
  }

  if (
    !(
      identicalPositionsCheck(currentMovePacket, middleMovePacket) &&
      identicalPositionsCheck(middleMovePacket, farthestMovePacket)
    )
  ) {
    return false
  }
  return true
}

export const evaluateDraw = (
  validOppMoves: SourceSquareAndValidMovesType,
  newOccupiedSquares: OccupiedSquaresType,
  newBoardState: BoardState,
  updatedMovesHistory: MoveHistoryType[],
  newFiftyMovesTracker: number
) => {
  const wOcc = newOccupiedSquares['w'].map(
    (square) => newBoardState[square].piece
  )
  const bOcc = newOccupiedSquares['b'].map(
    (square) => newBoardState[square].piece
  )
  const wLen = wOcc.length
  const bLen = bOcc.length
  const whiteOnlyKing = wLen === 1 && wOcc.includes('wk')
  const blackOnlyKing = bLen === 1 && bOcc.includes('bk')
  const blackInsufficientMaterial =
    whiteOnlyKing &&
    ((bLen === 2 &&
      bOcc.includes('bk') &&
      bOcc.some((bElem) => bElem.startsWith('bb') || bElem.startsWith('bn'))) ||
      blackOnlyKing)
  const whiteInsufficientMaterial =
    blackOnlyKing &&
    ((wLen === 2 &&
      wOcc.includes('wk') &&
      wOcc.some((wElem) => wElem.startsWith('wb') || wElem.startsWith('wn'))) ||
      whiteOnlyKing)
  const insufficientMaterial =
    blackInsufficientMaterial || whiteInsufficientMaterial
  let noValidMoves = true
  for (let srcSquare in validOppMoves) {
    if (validOppMoves[srcSquare].validSquares.length) {
      noValidMoves = false
      break
    }
  }
  const updatedMovesHistoryWithPresentState = [
    ...updatedMovesHistory,
    {
      srcSquare: '',
      destSquare: '',
      piece: '',
      boardBefore: newBoardState,
      boardAfter: newBoardState,
      occupiedSquares: newOccupiedSquares,
      capturedPieces: {w: [], b: []}
    },
  ]
  const threeFoldRepition =
    updatedMovesHistoryWithPresentState.length >= 9 &&
    threefoldRepitition(updatedMovesHistoryWithPresentState)
  return (
    noValidMoves ||
    insufficientMaterial ||
    threeFoldRepition ||
    newFiftyMovesTracker >= 50
  )
}
