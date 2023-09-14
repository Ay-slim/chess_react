import React from 'react';

type DragOverEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
export type SetColorStateType = React.Dispatch<React.SetStateAction<PlayerColor>>;
export type SetBoardStateType = React.Dispatch<React.SetStateAction<BoardState>>;
export type SetMoveHistoryType = React.Dispatch<React.SetStateAction<MoveHistoryType[]>>;
export type SetCapturedPieceType = React.Dispatch<React.SetStateAction<CapturedPiecesType>>;
export type GenericStringSetStateType = React.Dispatch<React.SetStateAction<string>>;


export type PlayerColor = 'w' | 'b';
export type PieceValidityTypes = 'n' | 'r' | 'b'; //Will ultimately extend this for all pieces (queen, knight etc etc)
export type BoardNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type OperationType = 'sum' | 'diff';

export type SquareProps = {
  id: string;
  onDragOver: DragOverEventHandler;
  pieceId?: string;
  currentColor: PlayerColor;
  setColor: SetColorStateType;
  currentBoard: BoardState;
  setBoardState: SetBoardStateType;
  setAlertMessage: GenericStringSetStateType
  movesHistory: MoveHistoryType[];
  setMoveHistory: SetMoveHistoryType;
  capturedPieces: CapturedPiecesType;
  setCapturedPiece: SetCapturedPieceType;
}

export type PieceProps = {
  id: string;
  currentColor: PlayerColor;
  squareId: string;
}

export type SquareInfoType = {
  loc: [BoardNumbers, BoardNumbers];
  piece: string;
}

export type BoardState = {
  [key: string]: SquareInfoType;
}

export type MoveHistoryType = {
  srcSquare: string;
  destSquare: string;
  piece: string;
  boardBefore: BoardState;
}

export type CapturedPiecesType = {
  w: string[];
  b: string[];
}