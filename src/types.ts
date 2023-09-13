import React from 'react';

type DropEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
type DragOverEventHandler = (ev: React.DragEvent<HTMLTableDataCellElement>) => void;
type DragStartEventHandler = (ev: React.DragEvent<HTMLImageElement>) => void;

export type SquareProps = {
  id: string;
  onDrop: DropEventHandler;
  onDragOver: DragOverEventHandler;
  pieceId?: string;
}

export type PieceProps = {
  id: string;
  onDragStart: DragStartEventHandler;
}

export type BoardState = {
  [key: string]: {
    loc: [number, number];
    piece: string;
  }
}