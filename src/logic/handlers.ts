import React from 'react';
import { BoardState, GenericStringSetStateType, MoveHistoryType, PieceTypes, PlayerColor, SetBoardStateType, SetColorStateType, SetMoveHistoryType, SquareInfoType } from '../types';
import { moveValidity } from './moveValidity';

export const allowDrop = (ev: React.DragEvent) => {
  ev.preventDefault();
};

export const drag = (squareId: string) => (ev: React.DragEvent) => {
  ev.dataTransfer.setData('drag_info', JSON.stringify({
    srcSquareId: squareId,
    pieceId: ev.currentTarget.id
  }));
};

export const drop = (colorState: PlayerColor, setColorState: SetColorStateType, currentBoard: BoardState, setBoardState: SetBoardStateType, setAlertMessage: GenericStringSetStateType, movesHistory: MoveHistoryType[], setMoveHistory: SetMoveHistoryType) => (ev: React.DragEvent) => {
  ev.preventDefault();
  const { srcSquareId, pieceId }: {srcSquareId: string, pieceId: string} = JSON.parse(ev.dataTransfer.getData('drag_info'));
  const targetSquareId = ev.currentTarget.id;

  if (moveValidity[pieceId[1] as PieceTypes](srcSquareId, targetSquareId,colorState, currentBoard )) {
    //Execute valid moves and update color state
    const srcSquareUpdated: SquareInfoType = {...currentBoard[srcSquareId], piece: ''}
    const targetSquareUpdated: SquareInfoType = {...currentBoard[targetSquareId], piece: pieceId}
    const move: MoveHistoryType = {
      srcSquare: srcSquareId,
      destSquare: targetSquareId,
      piece: pieceId,
      boardBefore: currentBoard
    }
    setBoardState({...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated})
    setMoveHistory(movesHistory.concat([move]));
    setColorState(colorState === 'w' ? 'b' : 'w');
    //This is going to be the fallback message if there are no other messages such as "Check!" etc
    setAlertMessage('')
    return;
  }
  setAlertMessage('Illegal move!')
};
