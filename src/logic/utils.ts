import { PlayOptions } from 'use-sound/dist/types'
import { GenericBooleanSetStateType, MoveHistoryType, MovesNotationType, OperationType, PlayerColor, SetBoardStateType, SetCheckMateType, SetMovesNotationType, SetPostGameTrackerType } from '../types'
import { io } from 'socket.io-client'

/**
 * Session storage items:
  * opponentId
  * multiPlayerColor
  * playerId
 */
export const socket = io(process.env.REACT_APP_WEBSOCKET_URL!)

export const normalizedArithmetic = (
  color: PlayerColor,
  op: OperationType,
  value1: number,
  value2: number
): number => {
  if (color === 'b') {
    if (op === 'sum') {
      return value1 - value2
    } else {
      return value1 + value2
    }
  } else {
    if (op === 'sum') {
      return value1 + value2
    } else {
      return value1 - value2
    }
  }
}

export const isValidBoardCoordinates = (x_coord: number, y_coord: number) => {
  return x_coord >= 0 && x_coord <= 7 && y_coord >= 0 && y_coord <= 7
}

export const INVERTED_SQUARES = {
  '0,0': 'a1',
  '1,0': 'b1',
  '2,0': 'c1',
  '3,0': 'd1',
  '4,0': 'e1',
  '5,0': 'f1',
  '6,0': 'g1',
  '7,0': 'h1',
  '0,1': 'a2',
  '1,1': 'b2',
  '2,1': 'c2',
  '3,1': 'd2',
  '4,1': 'e2',
  '5,1': 'f2',
  '6,1': 'g2',
  '7,1': 'h2',
  '0,2': 'a3',
  '1,2': 'b3',
  '2,2': 'c3',
  '3,2': 'd3',
  '4,2': 'e3',
  '5,2': 'f3',
  '6,2': 'g3',
  '7,2': 'h3',
  '0,3': 'a4',
  '1,3': 'b4',
  '2,3': 'c4',
  '3,3': 'd4',
  '4,3': 'e4',
  '5,3': 'f4',
  '6,3': 'g4',
  '7,3': 'h4',
  '0,4': 'a5',
  '1,4': 'b5',
  '2,4': 'c5',
  '3,4': 'd5',
  '4,4': 'e5',
  '5,4': 'f5',
  '6,4': 'g5',
  '7,4': 'h5',
  '0,5': 'a6',
  '1,5': 'b6',
  '2,5': 'c6',
  '3,5': 'd6',
  '4,5': 'e6',
  '5,5': 'f6',
  '6,5': 'g6',
  '7,5': 'h6',
  '0,6': 'a7',
  '1,6': 'b7',
  '2,6': 'c7',
  '3,6': 'd7',
  '4,6': 'e7',
  '5,6': 'f7',
  '6,6': 'g7',
  '7,6': 'h7',
  '0,7': 'a8',
  '1,7': 'b8',
  '2,7': 'c8',
  '3,7': 'd8',
  '4,7': 'e8',
  '5,7': 'f8',
  '6,7': 'g8',
  '7,7': 'h8',
}
export const CASTLING_ROOKS_MAP = {
  'w+ve': { rookId: 'wr1', rookSrc: 'h1', rookDest: 'f1', side: 'king' },
  'w-ve': { rookId: 'wr2', rookSrc: 'a1', rookDest: 'd1', side: 'queen' },
  'b+ve': { rookId: 'br1', rookSrc: 'h8', rookDest: 'f8', side: 'king' },
  'b-ve': { rookId: 'br2', rookSrc: 'a8', rookDest: 'd8', side: 'queen' },
}
export const CASTLING_ROOKS_DICT = {
  'w+ve': 'wr1',
  'w-ve': 'wr2',
  'b+ve': 'br1',
  'b-ve': 'br2',
}
export const CASTLING_SQUARES_TO_CHECK = {
  'w+ve': ['f1', 'g1'],
  'w-ve': ['c1', 'd1', 'b1'],
  'b+ve': ['f8', 'g8'],
  'b-ve': ['c8', 'd8', 'b8'],
}
export const VALID_CASTLING_SQUARES = {
  'w+ve': 'g1',
  'w-ve': 'c1',
  'b+ve': 'g8',
  'b-ve': 'c8',
}
export const ENPASSANT_ATTACKING_COLUMNS = { w: 4, b: 3 }
export const ENPASSANT_PAWN_MOVE_DIFF = { w: 2, b: -2 }
export const BASE_ROW_MAP = { w: 1, b: 6 }

export const decideTurn = (playerColor: PlayerColor, colorState: PlayerColor) => {
  if (playerColor === colorState)
    return 'Your turn'
  if (playerColor === 'w')
    return "Black's turn"
  return "White's turn"
}

export const decideCheckmate = (playerColor: PlayerColor, checkMateColor: PlayerColor, resignColor: PlayerColor) => {
  const opponentColor = playerColor === 'w' ? 'b' : 'w'
  const colorMap = {
    'w': 'White',
    'b': 'Black'
  }
  if (resignColor) {
    if (resignColor === playerColor)
      return `You resigned. ${colorMap[opponentColor]} wins.`
    return `${colorMap[opponentColor]} resigned. You win!`
  } else {
    if (playerColor === checkMateColor)
      return 'Checkmate! You win.'
    return `${colorMap[opponentColor]} wins.`
  }

}

export const toggleSound = (soundOn: boolean, setSoundOn: GenericBooleanSetStateType) => () => {
  soundOn ? setSoundOn(false) : setSoundOn(true)
}

export const resignGame = (
  setCheckMate: SetCheckMateType,
  setResign: SetCheckMateType,
  quitter: PlayerColor,
  notificationSound: (options?: PlayOptions | undefined) => void,
  soundOn: boolean,
  movesNotation: MovesNotationType[][],
  setMovesNotation: SetMovesNotationType,
  historyLength: number
) => () => {
  setResign(quitter)
  setCheckMate(quitter === 'w' ? 'b' : 'w') //WRONGGGG. This is basically piggybacking on using Checkmate to determine game end(because the checkMate state is used in multiple places to signify game end). Need a proper frame work that evaluates game end as the truthiness of checkmate, stalemate or resign
  
  const resignNotation = quitter === 'w' ? '0-1' : '1-0'
  updateMovesNotationState(resignNotation, movesNotation, setMovesNotation, historyLength)

  if (soundOn)
    notificationSound()
  const opponentId = sessionStorage.getItem('opponentId')
  socket.emit('resignation', opponentId)
}

export const updateMovesNotationState = (finalMoveNotation: string, movesNotation: MovesNotationType[][], setMovesNotation: SetMovesNotationType, movesHistoryLength: number) => {
  const lastMoveArrayHasLen1 = movesNotation.length && movesNotation[movesNotation.length - 1].length === 1
  const lastNotationArray = lastMoveArrayHasLen1 ? [...movesNotation[movesNotation.length - 1]] : []
  lastNotationArray.push({
    notation: finalMoveNotation,
    tracker: movesHistoryLength - 1
  })
  const arraySegmentToSpreadIndex = lastMoveArrayHasLen1 ? movesNotation.length - 1 : movesNotation.length
  setMovesNotation([...movesNotation.slice(0, arraySegmentToSpreadIndex), lastNotationArray])
}

export const handlePostGameClick = (setPostGameTracker: SetPostGameTrackerType, setBoardState: SetBoardStateType, postGameTracker: number | null, gameMovesHistory: MoveHistoryType[]) => {
  const postGameValueToSet = postGameTracker === -1 ? null : postGameTracker
  setPostGameTracker(postGameValueToSet)
  if (postGameValueToSet)
    setBoardState(gameMovesHistory[postGameValueToSet].boardAfter)
}