import React from 'react';

type DropEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
type DragOverEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
type DragStartEventHandler = (ev: React.DragEvent<HTMLImageElement>) => void;

export type PlayerColor = 'w' | 'b';

export type SquareProps = {
  id: string;
  onDrop: DropEventHandler;
  onDragOver: DragOverEventHandler;
  pieceId?: string;
  currentColor: PlayerColor;
}

export type PieceProps = {
  id: string;
  onDragStart: DragStartEventHandler;
  currentColor: PlayerColor;
}

export type BoardState = {
  [key: string]: {
    loc: [number, number];
    piece: string;
  }
}

export type SetColorStateProp = React.Dispatch<React.SetStateAction<PlayerColor>>;