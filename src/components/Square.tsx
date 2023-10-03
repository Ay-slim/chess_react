import { SquareProps } from "../types";
import Piece from "./Piece";
import { drop } from "../logic/handlers";
import '../App.css';

const Square = (props: SquareProps) => {
  const {id, onDragOver, pieceId, currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece, kingSquare, setKingSquare, kingInCheck, setKingInCheck, checkMate, setCheckMate, staleMate, setStaleMate, validMoves, setValidMoves, occupiedSquares, setOccupiedSquares, fiftyMovesTracker, setFiftyMovesTracker} = props
  const handleDrop = drop(currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece, kingSquare, setKingSquare, kingInCheck, setKingInCheck, setCheckMate, setStaleMate, validMoves, setValidMoves, occupiedSquares, setOccupiedSquares, fiftyMovesTracker, setFiftyMovesTracker)
  return (
    <th id={id} className={id} onDrop={handleDrop} onDragOver={onDragOver}>
      {pieceId ? <Piece id={pieceId} currentColor={currentColor} squareId={id} checkMate={checkMate} staleMate={staleMate}/>: ''}
    </th>
  );
}

export default Square