import React from 'react';
import { BoardState, CapturedPiecesType, GenericStringSetStateType, MoveHistoryType, PlayerColor, SetBoardStateType, SetCapturedPieceType, SetColorStateType, SetMoveHistoryType, SquareInfoType } from '../types';
import { moveValidityCheck } from './moveValidity';
import { isValidEnpassantMove } from './enpassant';

export const allowDrop = (ev: React.DragEvent) => {
  ev.preventDefault();
};

export const drag = (squareId: string) => (ev: React.DragEvent) => {
  ev.dataTransfer.setData('drag_info', JSON.stringify({
    srcSquareId: squareId,
    pieceId: ev.currentTarget.id
  }));
};

export const drop = (colorState: PlayerColor, setColorState: SetColorStateType, currentBoard: BoardState, setBoardState: SetBoardStateType, setAlertMessage: GenericStringSetStateType, movesHistory: MoveHistoryType[], setMoveHistory: SetMoveHistoryType, capturedPieces: CapturedPiecesType, setCapturedPiece: SetCapturedPieceType) => (ev: React.DragEvent) => {
  ev.preventDefault();
  const { srcSquareId, pieceId }: {srcSquareId: string, pieceId: string} = JSON.parse(ev.dataTransfer.getData('drag_info'));
  const targetSquareId = ev.currentTarget.id;
  const lastGameMove = movesHistory[movesHistory.length - 1];

  if (moveValidityCheck(srcSquareId, targetSquareId, colorState, currentBoard, lastGameMove, pieceId[1] )) {
    //Execute valid moves and update color state
    const isValidEnpassant = pieceId[1] === 'p' && isValidEnpassantMove(srcSquareId, targetSquareId, currentBoard, lastGameMove, colorState);
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
      setBoardState({...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated, [lastGameMove['destSquare']]: enpassantVictimUpdated})
      setCapturedPiece({...capturedPieces, [colorState]: capturedPieces[colorState].concat([lastGameMove['piece']])})
    } else {
      setBoardState({...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated})
      const destPiece = currentBoard[targetSquareId]['piece'];
      if (destPiece) {
        setCapturedPiece({...capturedPieces, [colorState]: capturedPieces[colorState].concat([destPiece])})
      }
    }
    setMoveHistory(movesHistory.concat([move]));
    setColorState(colorState === 'w' ? 'b' : 'w');
    //This is going to be the fallback message if there are no other messages such as "Check!" etc
    setAlertMessage('')
    return;
  }
  setAlertMessage('Illegal move!')
};
