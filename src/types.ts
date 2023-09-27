import React from 'react';

type DragOverEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
export type SetColorStateType = React.Dispatch<React.SetStateAction<PlayerColor>>;
export type SetBoardStateType = React.Dispatch<React.SetStateAction<BoardState>>;
export type SetMoveHistoryType = React.Dispatch<React.SetStateAction<MoveHistoryType[]>>;
export type SetCapturedPieceType = React.Dispatch<React.SetStateAction<CapturedPiecesType>>;
export type SetKingSquareType = React.Dispatch<React.SetStateAction<KingSquareType>>;
export type SetKingInCheckType = React.Dispatch<React.SetStateAction<KingCheckType>>
export type SetCheckMateType = React.Dispatch<React.SetStateAction<CheckMateType>>;
export type GenericStringSetStateType = React.Dispatch<React.SetStateAction<string>>;

export type PlayerColor = 'w' | 'b';
export type PieceValidityTypes = 'n' | 'r' | 'b' | 'q';
export type BoardNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type OperationType = 'sum' | 'diff';
export type PieceNameType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type CheckMateType = PlayerColor | null;

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
  kingSquare: KingSquareType;
  setKingSquare: SetKingSquareType;
  kingInCheck: KingCheckType;
  setKingInCheck: SetKingInCheckType;
  checkMate: CheckMateType;
  setCheckMate: SetCheckMateType;
}

export type PieceProps = {
  id: string;
  currentColor: PlayerColor;
  squareId: string;
  checkMate: CheckMateType;
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

export type KingSquareType = {
  w: string;
  b: string;
}

export type KingCheckType = {
  color: PlayerColor | null;
  validCheckMoves: {
    [key: string]: string[]
  }
}