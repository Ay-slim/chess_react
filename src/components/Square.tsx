import { SquareProps } from "../types";
import Piece from "./Piece";
import { drop } from "../logic/handlers";
import '../App.css';

const Square = (props: SquareProps) => {
  const {id, onDragOver, pieceId, currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece, kingSquare, setKingSquare, kingInCheck, setKingInCheck, checkMate, setCheckMate} = props
  const handleDrop = drop(currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece, kingSquare, setKingSquare, kingInCheck, setKingInCheck, checkMate, setCheckMate)
  return (
    <th id={id} className={id} onDrop={handleDrop} onDragOver={onDragOver}>
      {pieceId ? <Piece id={pieceId} currentColor={currentColor} squareId={id} checkMate={checkMate}/>: ''}
    </th>
  );
}

export default Square