import React from 'react';
import { BoardState, PlayerColor, SetBoardStateType, SetColorStateType, SquareInfoType } from '../types';

export const allowDrop = (ev: React.DragEvent) => {
  ev.preventDefault();
};

export const drag = (squareId: string) => (ev: React.DragEvent) => {
  console.log(ev.currentTarget, 'TARGETTT')
  ev.dataTransfer.setData('drag_info', JSON.stringify({
    srcSquareId: squareId,
    pieceId: ev.currentTarget.id
  }));
};

export const drop = (colorState: PlayerColor, setColorState: SetColorStateType, currentBoard: BoardState, setBoardState: SetBoardStateType) => (ev: React.DragEvent) => {
  ev.preventDefault();
  const { srcSquareId, pieceId } = JSON.parse(ev.dataTransfer.getData('drag_info'));
  const targetSquareId = ev.currentTarget.id;

  //Execute valid moves and update color state
  const srcSquareUpdated: SquareInfoType = {...currentBoard[srcSquareId], piece: ''}
  const targetSquareUpdated: SquareInfoType = {...currentBoard[targetSquareId], piece: pieceId}
  setBoardState({...currentBoard, [srcSquareId]: srcSquareUpdated, [targetSquareId]: targetSquareUpdated})
  setColorState(colorState === 'w' ? 'b' : 'w');
};
