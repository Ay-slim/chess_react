import { BoardState, MoveHistoryType, PieceValidityTypes, PlayerColor, PieceNameType, KingCheckType, CheckMateType, SetCheckMateType, SourceSquareAndValidMovesType } from "../../types";

import { default as corePawnValidity } from './pawn'
import { default as pawnValidity } from './pawnAug'
import { default as knightValidity } from './knight'
import { default as rookValidity } from './rook'
import { default as bishopValidity } from './bishop'
import { default as queenValidity } from './queen'
import { default as kingValidity } from './kingAug'
import { default as coreKingValidity } from './king'
import { default as generatePinnedSquares } from "../pinnedSquares"


const validityMap = {
  n: knightValidity,
  r: rookValidity,
  b: bishopValidity,
  q: queenValidity,
}

export const moveValidityCheck = (srcSquareId: string, destSquareId: string, color: PlayerColor, boardState: BoardState, gameMoves: MoveHistoryType[], pieceName: string, kingSquare: string, kingInCheck: KingCheckType, checkMate: CheckMateType, setCheckMate: SetCheckMateType) => {
  if (kingInCheck.color) {
    const { validCheckMoves } = kingInCheck
    if (validCheckMoves?.[srcSquareId] && validCheckMoves[srcSquareId].includes(destSquareId)) {
      return true
    }
    return false
  }

  const pinnedSquares = generatePinnedSquares(kingSquare, boardState, color)
  if (Object.keys(pinnedSquares).includes(srcSquareId)) {
    if (pinnedSquares[srcSquareId].validSquares.includes(destSquareId)) {
      return true
    }
    return false
  }

  if (pieceName === 'p') {
    return pawnValidity(srcSquareId, color, boardState, gameMoves).includes(destSquareId);
  } else if (pieceName === 'k') {
    return kingValidity(srcSquareId, color, boardState, gameMoves).includes(destSquareId);
  } else {
    return validityMap[pieceName as PieceValidityTypes](srcSquareId, color, boardState).includes(destSquareId);
  }
}

export const allValidMoves = (color: PlayerColor, boardState: BoardState, pinnedSquares: SourceSquareAndValidMovesType, movesHistory: MoveHistoryType[]) => {
  const allValidMovesMap: SourceSquareAndValidMovesType = {}
  const pinnedSquaresArr = Object.keys(pinnedSquares)
  for (let currentSquare in boardState) {
    const currentPiece = boardState[currentSquare]?.piece
    const currentPieceName = currentPiece[1]
    if (currentPiece[0] === color && !pinnedSquaresArr.includes(currentSquare)) {
      const validSquares = currentPieceName === 'p' ? pawnValidity(currentSquare, color, boardState, movesHistory)
       : currentPieceName === 'k' ? kingValidity(currentSquare, color, boardState, movesHistory) 
       :  validityMap[currentPieceName as PieceValidityTypes](currentSquare, color, boardState)
      allValidMovesMap[currentSquare] = {
        piece: boardState[currentSquare].piece,
        validSquares
      }
    }
  }
  return {...allValidMovesMap, ...pinnedSquares}
}

export const allThreatenedSquares = (color: PlayerColor, boardState: BoardState) => {
  const threatenedSquaresFns = {
    p: corePawnValidity,
    n: knightValidity,
    b: bishopValidity,
    r: rookValidity,
    q: queenValidity,
    k: coreKingValidity,
  }
  let threatenedSquaresArr: string[] = []
  for (const square of Object.keys(boardState)) {
    const piece = boardState[square].piece
    if (piece && piece[0] !== color) {
      const pieceName: PieceNameType = piece[1] as PieceNameType
      const colorArg = color === 'w' ? 'b' : 'w'
      const squaresThreatenedByThisPiece = threatenedSquaresFns[pieceName](square, colorArg, boardState, true)
      threatenedSquaresArr = threatenedSquaresArr.concat(squaresThreatenedByThisPiece)
    }
  }
  return Array.from(new Set(threatenedSquaresArr))
}