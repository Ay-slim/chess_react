import {
  PlayerColor,
  SetColorStateType,
  BoardState,
  SetBoardStateType,
  MoveHistoryType,
  SetMoveHistoryType,
  CapturedPiecesType,
  SetCapturedPieceType,
  KingSquareType,
  SetKingSquareType,
  SetKingInCheckType,
  SetCheckMateType,
  SetStaleMateType,
  SetValidMovesType,
  OccupiedSquaresType,
  SetOccupiedScaresType,
  SetFiftyMovesTrackerType,
  SquareInfoType,
  SetOpenPromotionModalType,
  SetPromotionSquaresInfoType,
  SetMovesNotationType,
  MovesNotationType,
} from '../types'
import { grabCastlingRookAndSquares } from './castling'
import { evaluateKingInCheck, validMovesWhenInCheck } from './check'
import { evaluateDraw } from './draw'
import { isValidEnpassantMove } from './enpassant'
import { allValidMoves } from './moveValidity'
import { default as generatePinnedSquares } from './pinnedSquares'
import { updateMovesNotationState } from './utils'

export const evaluateOpponentKingAndNextTurn = (
  shouldUpdateFiftyMovesTracker: boolean,
  fiftyMovesTracker: number,
  setFiftyMovesTracker: SetFiftyMovesTrackerType,
  updatedKingSquare: KingSquareType,
  colorState: PlayerColor,
  opponentColor: PlayerColor,
  newBoardState: BoardState,
  newOccupiedSquares: OccupiedSquaresType,
  setCheckMate: SetCheckMateType,
  setKingInCheck: SetKingInCheckType,
  updatedMovesHistory: MoveHistoryType[],
  setStaleMate: SetStaleMateType,
  setValidMoves: SetValidMovesType,
  setMoveHistory: SetMoveHistoryType,
  setColorState: SetColorStateType,
  moveNotation: string,
  movesNotation: MovesNotationType[][],
  setMovesNotation: SetMovesNotationType
) => {
  let newFiftyMovesTracker: number
  if (shouldUpdateFiftyMovesTracker) {
    newFiftyMovesTracker = 0
  } else {
    newFiftyMovesTracker = fiftyMovesTracker + 1
  }
  setFiftyMovesTracker(newFiftyMovesTracker)
  const kingInCheckDetails = evaluateKingInCheck(
    updatedKingSquare[opponentColor],
    newBoardState,
    opponentColor
  )
  if (Object.keys(kingInCheckDetails).length) {
    const validCheckMoves = validMovesWhenInCheck(
      opponentColor,
      kingInCheckDetails,
      newBoardState,
      updatedKingSquare[opponentColor],
      newOccupiedSquares
    )
    if (!Object.keys(validCheckMoves).length) {
      updateMovesNotationState(`${moveNotation}#`, movesNotation, setMovesNotation, updatedMovesHistory.length)
      setCheckMate(colorState)
    } else {
      updateMovesNotationState(`${moveNotation}+`, movesNotation, setMovesNotation, updatedMovesHistory.length)
      setKingInCheck({ color: opponentColor, validCheckMoves })
    }
  } else {
    updateMovesNotationState(moveNotation, movesNotation, setMovesNotation, updatedMovesHistory.length)
    setKingInCheck({ color: null, validCheckMoves: {} })
    const oppPinnedSquares = generatePinnedSquares(
      updatedKingSquare[opponentColor],
      newBoardState,
      opponentColor
    )
    const validOppMoves = allValidMoves(
      opponentColor,
      newBoardState,
      oppPinnedSquares,
      updatedMovesHistory,
      newOccupiedSquares
    )
    const gameEndsInDraw = evaluateDraw(
      validOppMoves,
      newOccupiedSquares,
      newBoardState,
      updatedMovesHistory,
      newFiftyMovesTracker
    )
    if (gameEndsInDraw) {
      updateMovesNotationState('½–½', movesNotation, setMovesNotation, updatedMovesHistory.length)
      setStaleMate(true)
    }
    setValidMoves(validOppMoves)
  }
  setMoveHistory(updatedMovesHistory)
  setColorState(colorState === 'w' ? 'b' : 'w')
}

export const executeValidMove = (
  srcSquareId: string,
  targetSquareId: string,
  pieceId: string,
  colorState: PlayerColor,
  setColorState: SetColorStateType,
  currentBoard: BoardState,
  setBoardState: SetBoardStateType,
  movesHistory: MoveHistoryType[],
  setMoveHistory: SetMoveHistoryType,
  capturedPieces: CapturedPiecesType,
  setCapturedPiece: SetCapturedPieceType,
  kingSquare: KingSquareType,
  setKingSquare: SetKingSquareType,
  setKingInCheck: SetKingInCheckType,
  setCheckMate: SetCheckMateType,
  setStaleMate: SetStaleMateType,
  setValidMoves: SetValidMovesType,
  occupiedSquares: OccupiedSquaresType,
  setOccupiedSquares: SetOccupiedScaresType,
  fiftyMovesTracker: number,
  setFiftyMovesTracker: SetFiftyMovesTrackerType,
  setOpenPromotionModal: SetOpenPromotionModalType,
  setPromotionSquaresInfo: SetPromotionSquaresInfoType,
  isPromotionMove: boolean = false,
  movesNotation: MovesNotationType[][],
  setMovesNotation: SetMovesNotationType
) => {
  //Execute valid moves and update appropriate states
  let moveNotation = pieceId[1] === 'p' ? `${targetSquareId}` : `${pieceId[1].toUpperCase()}${targetSquareId}`
  const lastGameMove = movesHistory[movesHistory.length - 1]
  let newBoardState: BoardState
  let newOccupiedSquares: OccupiedSquaresType
  let aPieceWasCaptured = false
  let updatedKingSquare: KingSquareType
  const opponentColor = colorState === 'w' ? 'b' : 'w'
  const isValidEnpassant =
    pieceId[1] === 'p' &&
    isValidEnpassantMove(
      srcSquareId,
      targetSquareId,
      currentBoard,
      lastGameMove,
      colorState
    )

  const castlingRookInfo = grabCastlingRookAndSquares(
    srcSquareId,
    targetSquareId,
    pieceId,
    currentBoard
  )
  const srcSquareUpdated: SquareInfoType = {
    ...currentBoard[srcSquareId],
    piece: '',
  }
  const targetSquareUpdated: SquareInfoType = {
    ...currentBoard[targetSquareId],
    piece: pieceId,
  }

  if (isPromotionMove) {
    setOpenPromotionModal(true)
    setPromotionSquaresInfo({ src: srcSquareId, dest: targetSquareId })
    return
  }

  if (isValidEnpassant) {
    const newCurrentColorOccupiedSquares = [...occupiedSquares[colorState]]
    newCurrentColorOccupiedSquares.splice(
      newCurrentColorOccupiedSquares.indexOf(srcSquareId),
      1
    )
    newCurrentColorOccupiedSquares.push(targetSquareId)
    const newOppColorOccupiedSquares = [...occupiedSquares[opponentColor]]
    newOppColorOccupiedSquares.splice(
      newOppColorOccupiedSquares.indexOf(lastGameMove.destSquare),
      1
    )
    newOccupiedSquares = {
      [colorState]: newCurrentColorOccupiedSquares,
      [opponentColor]: newOppColorOccupiedSquares,
    }
    setOccupiedSquares(newOccupiedSquares)
    const enpassantVictimUpdated = {
      ...currentBoard[lastGameMove['destSquare']],
      piece: '',
    }
    newBoardState = {
      ...currentBoard,
      [srcSquareId]: srcSquareUpdated,
      [targetSquareId]: targetSquareUpdated,
      [lastGameMove['destSquare']]: enpassantVictimUpdated,
    }
    setBoardState(newBoardState)
    aPieceWasCaptured = true
    setCapturedPiece({
      ...capturedPieces,
      [colorState]: capturedPieces[colorState].concat([lastGameMove['piece']]),
    })
  } else if (castlingRookInfo) {
    moveNotation = castlingRookInfo.side === 'king' ? 'O-O' : 'O-O-O'
    const newOccupiedSquaresState = [...occupiedSquares[colorState]]
    newOccupiedSquaresState.splice(
      newOccupiedSquaresState.indexOf(srcSquareId),
      1
    )
    newOccupiedSquaresState.splice(
      newOccupiedSquaresState.indexOf(castlingRookInfo.rookSrc),
      1
    )
    newOccupiedSquaresState.push(targetSquareId, castlingRookInfo.rookDest)
    newOccupiedSquares = {
      ...occupiedSquares,
      [colorState]: newOccupiedSquaresState,
    }
    setOccupiedSquares(newOccupiedSquares)
    const castlingRookSrcUpdated = {
      ...currentBoard[castlingRookInfo.rookSrc],
      piece: '',
    }
    const castlingRookDestUpdated = {
      ...currentBoard[castlingRookInfo.rookDest],
      piece: castlingRookInfo.rookId,
    }
    newBoardState = {
      ...currentBoard,
      [srcSquareId]: srcSquareUpdated,
      [targetSquareId]: targetSquareUpdated,
      [castlingRookInfo.rookSrc]: castlingRookSrcUpdated,
      [castlingRookInfo.rookDest]: castlingRookDestUpdated,
    }
    setBoardState(newBoardState)
  } else {
    newBoardState = {
      ...currentBoard,
      [srcSquareId]: srcSquareUpdated,
      [targetSquareId]: targetSquareUpdated,
    }
    setBoardState(newBoardState)
    const occupiedSquaresCurrColor = [...occupiedSquares[colorState]]
    occupiedSquaresCurrColor.splice(
      occupiedSquaresCurrColor.indexOf(srcSquareId),
      1
    )
    occupiedSquaresCurrColor.push(targetSquareId)
    const occupiedSquaresOppColor = [...occupiedSquares[opponentColor]]
    const destPiece = currentBoard[targetSquareId]['piece']
    if (destPiece) {
      moveNotation = pieceId[1] === 'p' ? `${srcSquareId[0]}x${targetSquareId}` : `${pieceId[1].toUpperCase()}x${targetSquareId}`
      aPieceWasCaptured = true
      setCapturedPiece({
        ...capturedPieces,
        [colorState]: capturedPieces[colorState].concat([destPiece]),
      })
      occupiedSquaresOppColor.splice(
        occupiedSquaresOppColor.indexOf(targetSquareId),
        1
      )
    }
    newOccupiedSquares = {
      [colorState]: occupiedSquaresCurrColor,
      [opponentColor]: occupiedSquaresOppColor,
    }
    setOccupiedSquares(newOccupiedSquares)
  }
  if (pieceId[1] === 'k') {
    //When you move the king, update the king square state
    updatedKingSquare = { ...kingSquare, [colorState]: targetSquareId }
    // Not necessarily urgent to ensure that the current color king square state
    // is updated as we really only care about the oppohnent king square for
    // purposes of evaluating check, checkmate or draw, but who knows, down the line
    // the current color state may become useful
    setKingSquare(updatedKingSquare)
  } else {
    updatedKingSquare = kingSquare
  }
  const shouldUpdateFiftyMovesTracker = pieceId[1] === 'p' || aPieceWasCaptured
  const move: MoveHistoryType = {
    srcSquare: srcSquareId,
    destSquare: targetSquareId,
    piece: pieceId,
    boardBefore: currentBoard,
    boardAfter: newBoardState,
    occupiedSquares,
  }
  const updatedMovesHistory = [...movesHistory, move]
  moveNotation = isPromotionMove ? '' : moveNotation
  evaluateOpponentKingAndNextTurn(
    shouldUpdateFiftyMovesTracker,
    fiftyMovesTracker,
    setFiftyMovesTracker,
    updatedKingSquare,
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
    setColorState,
    moveNotation,
    movesNotation,
    setMovesNotation
  )
}
