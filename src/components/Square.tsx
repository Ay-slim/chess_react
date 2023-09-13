import { SquareProps } from "../types";
import Piece from "./Piece";
import { drop } from "../logic/utils";
import '../App.css';

const Square = (props: SquareProps) => {
  const {id, onDragOver, pieceId, currentColor, setColor, currentBoard, setBoardState} = props
  const handleDrop = drop(currentColor, setColor, currentBoard, setBoardState)
  return (
    <th id={id} className={id} onDrop={handleDrop} onDragOver={onDragOver}>
      {pieceId ? <Piece id={pieceId} currentColor={currentColor} squareId={id}/>: ''}
    </th>
  );
}

export default Square