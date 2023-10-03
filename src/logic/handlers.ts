import React from 'react'
import {
  BoardState,
  CapturedPiecesType,
  GenericStringSetStateType,
  KingCheckType,
  KingSquareType,
  MoveHistoryType,
  OccupiedSquaresType,
  PlayerColor,
  SetBoardStateType,
  SetCapturedPieceType,
  SetCheckMateType,
  SetColorStateType,
  SetFiftyMovesTrackerType,
  SetKingInCheckType,
  SetKingSquareType,
  SetMoveHistoryType,
  SetOccupiedScaresType,
  SetStaleMateType,
  SetValidMovesType,
  SourceSquareAndValidMovesType,
} from '../types'
import { moveValidityCheck } from './moveValidity'
import { executeValidMove } from './executeMove'

export const allowDrop = (ev: React.DragEvent) => {
  ev.preventDefault()
}

export const drag = (squareId: string) => (ev: React.DragEvent) => {
  ev.dataTransfer.setData(
    'drag_info',
    JSON.stringify({
      srcSquareId: squareId,
      pieceId: ev.currentTarget.id,
    })
  )
}

export const drop =
  (
    colorState: PlayerColor,
    setColorState: SetColorStateType,
    currentBoard: BoardState,
    setBoardState: SetBoardStateType,
    setAlertMessage: GenericStringSetStateType,
    movesHistory: MoveHistoryType[],
    setMoveHistory: SetMoveHistoryType,
    capturedPieces: CapturedPiecesType,
    setCapturedPiece: SetCapturedPieceType,
    kingSquare: KingSquareType,
    setKingSquare: SetKingSquareType,
    kingInCheck: KingCheckType,
    setKingInCheck: SetKingInCheckType,
    setCheckMate: SetCheckMateType,
    setStaleMate: SetStaleMateType,
    validMoves: SourceSquareAndValidMovesType,
    setValidMoves: SetValidMovesType,
    occupiedSquares: OccupiedSquaresType,
    setOccupiedSquares: SetOccupiedScaresType,
    fiftyMovesTracker: number,
    setFiftyMovesTracker: SetFiftyMovesTrackerType
  ) =>
  (ev: React.DragEvent) => {
    ev.preventDefault()
    const { srcSquareId, pieceId }: { srcSquareId: string; pieceId: string } =
      JSON.parse(ev.dataTransfer.getData('drag_info'))
    const targetSquareId = ev.currentTarget.id

    if (
      moveValidityCheck(srcSquareId, targetSquareId, kingInCheck, validMoves)
    ) {
      executeValidMove(
        srcSquareId,
        targetSquareId,
        pieceId,
        colorState,
        setColorState,
        currentBoard,
        setBoardState,
        setAlertMessage,
        movesHistory,
        setMoveHistory,
        capturedPieces,
        setCapturedPiece,
        kingSquare,
        setKingSquare,
        setKingInCheck,
        setCheckMate,
        setStaleMate,
        setValidMoves,
        occupiedSquares,
        setOccupiedSquares,
        fiftyMovesTracker,
        setFiftyMovesTracker
      )
      return
    }
    setAlertMessage('Illegal move!')
  }
