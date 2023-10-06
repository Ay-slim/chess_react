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
  PromotedPiecesTrackerType,
  PromotionSquaresInfoType,
  SetBoardStateType,
  SetCapturedPieceType,
  SetCheckMateType,
  SetColorStateType,
  SetFiftyMovesTrackerType,
  SetKingInCheckType,
  SetKingSquareType,
  SetMoveHistoryType,
  SetOccupiedScaresType,
  SetOpenPromotionModalType,
  SetPromotedPiecesTrackerType,
  SetPromotionSquaresInfoType,
  SetStaleMateType,
  SetValidMovesType,
  SourceSquareAndValidMovesType,
} from '../types'
import { moveValidityCheck } from './moveValidity'
import {
  evaluateOpponentKingAndNextTurn,
  executeValidMove,
} from './executeMove'

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
    setFiftyMovesTracker: SetFiftyMovesTrackerType,
    setOpenPromotionModal: SetOpenPromotionModalType,
    setPromotionSquaresInfo: SetPromotionSquaresInfoType
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
        setFiftyMovesTracker,
        setOpenPromotionModal,
        setPromotionSquaresInfo
      )
      return
    }
    setAlertMessage('Illegal move!')
  }

export const onPromotionClick = (
  fiftyMovesTracker: number,
  setFiftyMovesTracker: SetFiftyMovesTrackerType,
  occupiedSquares: OccupiedSquaresType,
  setOccupiedSquares: SetOccupiedScaresType,
  colorState: PlayerColor,
  setBoardState: SetBoardStateType,
  pieceId: 'b' | 'n' | 'q' | 'r',
  promotedPiecesTracker: PromotedPiecesTrackerType,
  setPromotedPiecesTracker: SetPromotedPiecesTrackerType,
  promotionSquaresInfo: PromotionSquaresInfoType,
  currentBoard: BoardState,
  capturedPieces: CapturedPiecesType,
  setCapturedPiece: SetCapturedPieceType,
  movesHistory: MoveHistoryType[],
  setMoveHistory: SetMoveHistoryType,
  setColor: SetColorStateType,
  kingSquare: KingSquareType,
  setCheckMate: SetCheckMateType,
  setKingInCheck: SetKingInCheckType,
  setStaleMate: SetStaleMateType,
  setValidMoves: SetValidMovesType,
  setAlertMessage: GenericStringSetStateType,
  setOpenPromotionModal: SetOpenPromotionModalType
) => {
  const newPieceCount = promotedPiecesTracker[pieceId] + 1
  const promotedPiece = `${colorState}${pieceId}${newPieceCount}`
  setPromotedPiecesTracker({
    ...promotedPiecesTracker,
    [pieceId]: newPieceCount,
  })
  const srcSquareId = promotionSquaresInfo.src
  const targetSquareId = promotionSquaresInfo.dest
  const srcSquareUpdated = {
    ...currentBoard[srcSquareId],
    piece: '',
  }
  const destSquareUpdated = {
    ...currentBoard[targetSquareId],
    piece: promotedPiece,
  }
  const newBoardState = {
    ...currentBoard,
    [srcSquareId]: srcSquareUpdated,
    [targetSquareId]: destSquareUpdated,
  }
  setBoardState(newBoardState)
  const occupiedSquaresCurrColor = [...occupiedSquares[colorState]]
  occupiedSquaresCurrColor.splice(
    occupiedSquaresCurrColor.indexOf(srcSquareId),
    1
  )
  occupiedSquaresCurrColor.push(targetSquareId)
  const opponentColor = colorState === 'w' ? 'b' : 'w'
  const occupiedSquaresOppColor = [...occupiedSquares[opponentColor]]
  const destPiece = currentBoard[targetSquareId]['piece']
  if (destPiece) {
    setCapturedPiece({
      ...capturedPieces,
      [colorState]: capturedPieces[colorState].concat([destPiece]),
    })
    occupiedSquaresOppColor.splice(
      occupiedSquaresOppColor.indexOf(targetSquareId),
      1
    )
  }
  const newOccupiedSquares = {
    [colorState]: occupiedSquaresCurrColor,
    [opponentColor]: occupiedSquaresOppColor,
  }
  setOccupiedSquares(newOccupiedSquares)
  const move: MoveHistoryType = {
    srcSquare: srcSquareId,
    destSquare: targetSquareId,
    piece: pieceId,
    boardBefore: currentBoard,
    occupiedSquares,
  }
  const updatedMovesHistory = [...movesHistory, move]
  evaluateOpponentKingAndNextTurn(
    true,
    fiftyMovesTracker,
    setFiftyMovesTracker,
    kingSquare,
    colorState,
    opponentColor,
    newBoardState,
    newOccupiedSquares,
    setCheckMate,
    setKingInCheck,
    updatedMovesHistory,
    setStaleMate,
    setValidMoves,
    setMoveHistory,
    setColor,
    setAlertMessage
  )
  setOpenPromotionModal(false)
}

export const closePromotionModal =
  (setOpenPromotionModal: SetOpenPromotionModalType) =>
  (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPromotionModal(false)
  }
