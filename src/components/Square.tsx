import { SquareProps } from "../types";
import Piece from "./Piece";
import { drop } from "../logic/handlers";
import '../App.css';

const Square = (props: SquareProps) => {
  const {id, onDragOver, pieceId, currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece, kingSquare, setKingSquare, kingInCheck, setKingInCheck} = props
  const handleDrop = drop(currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece, kingSquare, setKingSquare, kingInCheck, setKingInCheck)
  return (
    <th id={id} className={id} onDrop={handleDrop} onDragOver={onDragOver}>
      {pieceId ? <Piece id={pieceId} currentColor={currentColor} squareId={id}/>: ''}
    </th>
  );
}

export default Square