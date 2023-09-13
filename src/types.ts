import React from 'react';

type DropEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
type DragOverEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
export type SetColorStateType = React.Dispatch<React.SetStateAction<PlayerColor>>;
export type SetBoardStateType = React.Dispatch<React.SetStateAction<BoardState>>;


export type PlayerColor = 'w' | 'b';

export type OperationType = 'sum' | 'diff';

export type SquareProps = {
  id: string;
  onDragOver: DragOverEventHandler;
  pieceId?: string;
  currentColor: PlayerColor;
  setColor: SetColorStateType;
  currentBoard: BoardState;
  setBoardState: SetBoardStateType;
}

export type PieceProps = {
  id: string;
  currentColor: PlayerColor;
  squareId: string;
}

export type SquareInfoType = {
  loc: [number, number];
  piece: string;
}

export type BoardState = {
  [key: string]: SquareInfoType;
}


export type DropEventWrapper = (colorState: PlayerColor, setColorState: SetColorStateType, currentBoard: BoardState, setBoardState: SetBoardStateType) => DropEventHandler