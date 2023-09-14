import { SquareProps } from "../types";
import Piece from "./Piece";
import { drop } from "../logic/handlers";
import '../App.css';

const Square = (props: SquareProps) => {
  const {id, onDragOver, pieceId, currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece} = props
  const handleDrop = drop(currentColor, setColor, currentBoard, setBoardState, setAlertMessage, movesHistory, setMoveHistory, capturedPieces, setCapturedPiece)
  return (
    <th id={id} className={id} onDrop={handleDrop} onDragOver={onDragOver}>
      {pieceId ? <Piece id={pieceId} currentColor={currentColor} squareId={id}/>: ''}
    </th>
  );
}

export default Square