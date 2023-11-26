import React from 'react'

type DragOverEventHandler = (
  ev: React.DragEvent<HTMLTableDataCellElement>
) => void
export type SetColorStateType = React.Dispatch<
  React.SetStateAction<PlayerColor>
>
export type SetBoardStateType = React.Dispatch<React.SetStateAction<BoardState>>
export type SetMoveHistoryType = React.Dispatch<
  React.SetStateAction<MoveHistoryType[]>
>
export type SetCapturedPieceType = React.Dispatch<
  React.SetStateAction<CapturedPiecesType>
>
export type SetKingSquareType = React.Dispatch<
  React.SetStateAction<KingSquareType>
>
export type SetKingInCheckType = React.Dispatch<
  React.SetStateAction<KingCheckType>
>
export type SetCheckMateType = React.Dispatch<
  React.SetStateAction<CheckMateType>
>
export type SetStaleMateType = React.Dispatch<React.SetStateAction<Boolean>>
export type SetValidMovesType = React.Dispatch<
  React.SetStateAction<SourceSquareAndValidMovesType>
>
export type SetOccupiedScaresType = React.Dispatch<
  React.SetStateAction<OccupiedSquaresType>
>
export type SetFiftyMovesTrackerType = React.Dispatch<
  React.SetStateAction<number>
>
export type SetOpenPromotionModalType = React.Dispatch<
  React.SetStateAction<boolean>
>
export type SetPromotedPiecesTrackerType = React.Dispatch<
  React.SetStateAction<PromotedPiecesTrackerType>
>
export type SetPromotionSquaresInfoType = React.Dispatch<
  React.SetStateAction<PromotionSquaresInfoType>
>
export type SetMovesNotationType = React.Dispatch<
  React.SetStateAction<MovesNotationType[][]>
>
export type GenericStringSetStateType = React.Dispatch<
  React.SetStateAction<string>
>

export type GenericBooleanSetStateType = React.Dispatch<
  React.SetStateAction<boolean>
>

export type PlayerColor = 'w' | 'b'
export type PieceValidityTypes = 'n' | 'r' | 'b' | 'q'
export type BoardNumbers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type OperationType = 'sum' | 'diff'
export type PieceNameType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
export type CheckMateType = PlayerColor | null

export type SquareProps = {
  id: string
  onDragOver: DragOverEventHandler
  pieceId?: string
  currentColor: PlayerColor
  setColor: SetColorStateType
  currentBoard: BoardState
  setBoardState: SetBoardStateType
  movesHistory: MoveHistoryType[]
  setMoveHistory: SetMoveHistoryType
  capturedPieces: CapturedPiecesType
  setCapturedPiece: SetCapturedPieceType
  kingSquare: KingSquareType
  setKingSquare: SetKingSquareType
  kingInCheck: KingCheckType
  setKingInCheck: SetKingInCheckType
  checkMate: CheckMateType
  setCheckMate: SetCheckMateType
  staleMate: Boolean
  setStaleMate: SetStaleMateType
  validMoves: SourceSquareAndValidMovesType
  setValidMoves: SetValidMovesType
  occupiedSquares: OccupiedSquaresType
  setOccupiedSquares: SetOccupiedScaresType
  fiftyMovesTracker: number
  setFiftyMovesTracker: SetFiftyMovesTrackerType
  setOpenPromotionModal: SetOpenPromotionModalType
  setPromotionSquaresInfo: SetPromotionSquaresInfoType
  clickedSquare: string
  setClickedSquare: GenericStringSetStateType
  movesNotation: MovesNotationType[][]
  setMovesNotation: SetMovesNotationType
}

export type PieceProps = {
  id: string
  currentColor: PlayerColor
  squareId: string
  checkMate: CheckMateType
  staleMate: Boolean
  setClickedSquare: GenericStringSetStateType
}

export type PromotionProps = {
  colorState: PlayerColor
  setOpenPromotionModal: SetOpenPromotionModalType
  fiftyMovesTracker: number
  occupiedSquares: OccupiedSquaresType
  setOccupiedSquares: SetOccupiedScaresType
  promotedPiecesTracker: PromotedPiecesTrackerType
  setPromotedPiecesTracker: SetPromotedPiecesTrackerType
  promotionSquaresInfo: PromotionSquaresInfoType
  currentBoard: BoardState
  setBoardState: SetBoardStateType
  capturedPieces: CapturedPiecesType
  setCapturedPieces: SetCapturedPieceType
  movesHistory: MoveHistoryType[]
  setMovesHistory: SetMoveHistoryType
  setColorState: SetColorStateType
  setFiftyMovesTracker: SetFiftyMovesTrackerType
  kingSquare: KingSquareType
  setCheckmate: SetCheckMateType
  setKingInCheck: SetKingInCheckType
  setStalemate: SetStaleMateType
  setValidMoves: SetValidMovesType
  movesNotation: MovesNotationType[][]
  setMovesNotation: SetMovesNotationType
}

export type SquareInfoType = {
  loc: [BoardNumbers, BoardNumbers]
  piece: string
}

export type BoardState = {
  [key: string]: SquareInfoType
}

export type MoveHistoryType = {
  srcSquare: string
  destSquare: string
  piece: string
  boardBefore: BoardState
  occupiedSquares: OccupiedSquaresType
}

export type CapturedPiecesType = {
  w: string[]
  b: string[]
}

export type KingSquareType = {
  w: string
  b: string
}

export type KingCheckType = {
  color: PlayerColor | null
  validCheckMoves: {
    [key: string]: string[]
  }
}

export type SourceSquareAndValidMovesType = {
  [key: string]: {
    piece: string
    validSquares: string[]
  }
}

export type OccupiedSquaresType = {
  [key: string]: string[]
}

export type MoveComparisonType = {
  boardState: BoardState
  occupiedSquares: string[]
}

export type PromotedPiecesTrackerType = {
  q: number
  r: number
  n: number
  b: number
}

export type PromotionSquaresInfoType = {
  src: string
  dest: string
}

export type WebSocketMessageType = {
  srcSquareId: string;
  targetSquareId: string;
  pieceId: string;
  opponentId: string;
  promotionSquaresInfo?: PromotionSquaresInfoType;
}

export type PromotedOfficialsType = 'b' | 'n' | 'q' | 'r'

export type CapturedPiecesContainerType = {
  capturedPieces: string[]
}

export type MovesNotationType = {
  notation: string;
  tracker: number;
}

export type MovesHistoryPropType = {
  moves: MovesNotationType[][]
}