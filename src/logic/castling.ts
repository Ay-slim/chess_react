import { BoardState, PlayerColor } from '../types'
import {
  CASTLING_ROOKS_MAP,
  CASTLING_SQUARES_TO_CHECK,
  VALID_CASTLING_SQUARES,
} from './utils'

export const castlingCheck = (
  color: PlayerColor,
  direction: '+ve' | '-ve' | '+ve' | '-ve',
  boardState: BoardState,
  allSquaresUnderAttack: string[]
) => {
  const squaresToCheck = CASTLING_SQUARES_TO_CHECK[`${color}${direction}`]
  for (let j of squaresToCheck) {
    if (boardState[j]['piece'] || allSquaresUnderAttack.includes(j)) {
      return ''
    }
  }
  return VALID_CASTLING_SQUARES[`${color}${direction}`]
}

export const grabCastlingRookAndSquares = (
  squareId: string,
  dest: string,
  pieceId: string,
  boardState: BoardState
) => {
  const xDiff = boardState[dest].loc[0] - boardState[squareId].loc[0]
  if (![2, -2].includes(xDiff) || pieceId[1] !== 'k') {
    return null
  }
  const castlingDirection = xDiff === 2 ? '+ve' : '-ve'
  return CASTLING_ROOKS_MAP[`${pieceId[0] as PlayerColor}${castlingDirection}`]
}
