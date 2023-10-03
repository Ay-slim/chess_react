import {
  PlayerColor,
  SetColorStateType,
  BoardState,
  SetBoardStateType,
  GenericStringSetStateType,
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
} from '../types'
import { grabCastlingRookAndSquares } from './castling'
import { evaluateKingInCheck, validMovesWhenInCheck } from './check'
import { evaluateDraw } from './draw'
import { isValidEnpassantMove } from './enpassant'
import { allValidMoves } from './moveValidity'
import { default as generatePinnedSquares } from './pinnedSquares'

export const executeValidMove = (
  srcSquareId: string,
  targetSquareId: string,
  pieceId: string,
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
  setKingInCheck: SetKingInCheckType,
  setCheckMate: SetCheckMateType,
  setStaleMate: SetStaleMateType,
  setValidMoves: SetValidMovesType,
  occupiedSquares: OccupiedSquaresType,
  setOccupiedSquares: SetOccupiedScaresType,
  fiftyMovesTracker: number,
  setFiftyMovesTracker: SetFiftyMovesTrackerType
) => {
  //Execute valid moves and update appropriate states
  const lastGameMove = movesHistory[movesHistory.length - 1]
  let newBoardState: BoardState
  let newOccupiedSquares: OccupiedSquaresType
  let aPieceWasCaptured = false
  let newFiftyMovesTracker: number
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
  const move: MoveHistoryType = {
    srcSquare: srcSquareId,
    destSquare: targetSquareId,
    piece: pieceId,
    boardBefore: currentBoard,
    occupiedSquares,
  }
  const updatedMovesHistory = [...movesHistory, move]
  //console.log(updatedMovesHistory)
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
    setKingSquare({ ...kingSquare, [colorState]: targetSquareId })
  }
  if (pieceId[1] === 'p' || aPieceWasCaptured) {
    newFiftyMovesTracker = 0
  } else {
    newFiftyMovesTracker = fiftyMovesTracker + 1
  }
  setFiftyMovesTracker(newFiftyMovesTracker)
  const kingInCheckDetails = evaluateKingInCheck(
    kingSquare[opponentColor],
    newBoardState,
    opponentColor
  )
  if (Object.keys(kingInCheckDetails).length) {
    const validCheckMoves = validMovesWhenInCheck(
      opponentColor,
      kingInCheckDetails,
      newBoardState,
      kingSquare[opponentColor],
      newOccupiedSquares
    )
    if (!Object.keys(validCheckMoves).length) {
      setCheckMate(colorState)
    } else {
      setKingInCheck({ color: opponentColor, validCheckMoves })
    }
  } else {
    setKingInCheck({ color: null, validCheckMoves: {} })
    const oppPinnedSquares = generatePinnedSquares(
      kingSquare[opponentColor],
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
      setStaleMate(true)
    }
    setValidMoves(validOppMoves)
  }
  setMoveHistory(updatedMovesHistory)
  setColorState(colorState === 'w' ? 'b' : 'w')
  //This is going to be the fallback message if there are no other messages such as "Check!" etc
  setAlertMessage('')
}
