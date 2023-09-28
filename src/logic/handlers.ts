import React from 'react';
import { BoardState, CapturedPiecesType, GenericStringSetStateType, KingCheckType, KingSquareType, MoveHistoryType, PlayerColor, SetBoardStateType, SetCapturedPieceType, SetCheckMateType, SetColorStateType, SetKingInCheckType, SetKingSquareType, SetMoveHistoryType, SetStaleMateType, SetValidMovesType, SourceSquareAndValidMovesType, SquareInfoType } from '../types';
import { allValidMoves, moveValidityCheck } from './moveValidity';
import { isValidEnpassantMove } from './enpassant';
import { grabCastlingRookAndSquares } from './castling';
import { evaluateKingInCheck, validMovesWhenInCheck } from './check';
import { default as generatePinnedSquares } from './pinnedSquares'

export const allowDrop = (ev: React.DragEvent) => {
  ev.preventDefault();
};

export const drag = (squareId: string) => (ev: React.DragEvent) => {
  ev.dataTransfer.setData('drag_info', JSON.stringify({
    srcSquareId: squareId,
    pieceId: ev.currentTarget.id
  }));
};

export const drop = (colorState: PlayerColor, setColorState: SetColorStateType, currentBoard: BoardState, setBoardState: SetBoardStateType, setAlertMessage: GenericStringSetStateType, movesHistory: MoveHistoryType[], setMoveHistory: SetMoveHistoryType, capturedPieces: CapturedPiecesType, setCapturedPiece: SetCapturedPieceType, kingSquare: KingSquareType, setKingSquare: SetKingSquareType, kingInCheck: KingCheckType, setKingInCheck: SetKingInCheckType, setCheckMate: SetCheckMateType, setStaleMate: SetStaleMateType, validMoves: SourceSquareAndValidMovesType, setValidMoves: SetValidMovesType) => (ev: React.DragEvent) => {
  ev.preventDefault();
  const { srcSquareId, pieceId }: {srcSquareId: string, pieceId: string} = JSON.parse(ev.dataTransfer.getData('drag_info'));
  const targetSquareId = ev.currentTarget.id;
  const lastGameMove = movesHistory[movesHistory.length - 1];
  let newBoardState: BoardState

  if (moveValidityCheck(srcSquareId, targetSquareId,  kingInCheck, validMoves)) {
    //Execute valid moves and update color state
    const isValidEnpassant = pieceId[1] === 'p' && isValidEnpassantMove(srcSquareId, targetSquareId, currentBoard, lastGameMove, colorState);
    const castlingRookInfo = grabCastlingRookAndSquares(srcSquareId, targetSquareId, pieceId, currentBoard);
    const srcSquareUpdated: SquareInfoType = {...currentBoard[srcSquareId], piece: ''}
    const targetSquareUpdated: SquareInfoType =  {...currentBoard[targetSquareId], piece: pieceId}
    const move: MoveHistoryType = {
      srcSquare: srcSquareId,
      destSquare: targetSquareId,
      piece: pieceId,
      boardBefore: currentBoard
    }
    if (isValidEnpassant) {
      const enpassantVictimUpdated = {...currentBoard[lastGameMove['destSquare']], piece: ''}
      newBoardState = {...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated, [lastGameMove['destSquare']]: enpassantVictimUpdated}
      setBoardState(newBoardState)
      setCapturedPiece({...capturedPieces, [colorState]: capturedPieces[colorState].concat([lastGameMove['piece']])})
    } else if (castlingRookInfo) {
      const castlingRookSrcUpdated = { ...currentBoard[castlingRookInfo.rookSrc], piece: '' };
      const castlingRookDestUpdated = { ...currentBoard[castlingRookInfo.rookDest], piece: castlingRookInfo.rookId }
      newBoardState = {...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated, [castlingRookInfo.rookSrc]: castlingRookSrcUpdated, [castlingRookInfo.rookDest]: castlingRookDestUpdated}
      setBoardState(newBoardState)
    } else {
      newBoardState = {...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated}
      setBoardState(newBoardState)
      const destPiece = currentBoard[targetSquareId]['piece'];
      if (destPiece) {
        setCapturedPiece({...capturedPieces, [colorState]: capturedPieces[colorState].concat([destPiece])})
      }
    }
    if (pieceId[1] === 'k') {
      //When you move the king, update the king square state
      setKingSquare({...kingSquare, [colorState]: targetSquareId})
    }
    const opponentColor = colorState === 'w' ? 'b' : 'w'
    const kingInCheckDetails = evaluateKingInCheck(kingSquare[opponentColor], newBoardState, opponentColor)
    if (Object.keys(kingInCheckDetails).length) {
      const validCheckMoves = validMovesWhenInCheck(opponentColor, kingInCheckDetails, newBoardState, kingSquare[opponentColor])
      if (!Object.keys(validCheckMoves).length) {
        setCheckMate(colorState)
      } else {
        setKingInCheck({color: opponentColor, validCheckMoves})
      }
    } else {
      setKingInCheck({color: null, validCheckMoves: {}})
      const oppPinnedSquares = generatePinnedSquares(kingSquare[opponentColor], newBoardState, opponentColor)
      const validOppMoves = allValidMoves(opponentColor, newBoardState, oppPinnedSquares, movesHistory)
      let noValidMoves = true
      for (let srcSquare in validOppMoves) {
        if (validOppMoves[srcSquare].validSquares.length) {
          noValidMoves = false
          break
        }
      }
      if (noValidMoves) {
        setStaleMate(true)
      }
      setValidMoves(validOppMoves)
    }
    setMoveHistory(movesHistory.concat([move]));
    setColorState(colorState === 'w' ? 'b' : 'w');
    //This is going to be the fallback message if there are no other messages such as "Check!" etc
    setAlertMessage('')
    return;
  }
  setAlertMessage('Illegal move!')
};