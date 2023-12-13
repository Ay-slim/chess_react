import {
  BoardState,
  OccupiedSquaresType,
  SourceSquareAndValidMovesType,
} from '../types'

export const evaluateDraw = (
  validOppMoves: SourceSquareAndValidMovesType,
  newOccupiedSquares: OccupiedSquaresType,
  newBoardState: BoardState,
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
  return (
    noValidMoves ||
    insufficientMaterial ||
    newFiftyMovesTracker >= 50
  )
}
