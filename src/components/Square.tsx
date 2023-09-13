import { SquareProps } from "../types";
import Piece from "./Piece";
import { drag } from "../logic/utils";
import '../App.css';

const Square = (props: SquareProps) => {
  const {id, onDrop, onDragOver, pieceId} = props
  return (
    <th id={id} className={id} onDrop={onDrop} onDragOver={onDragOver}>
      {pieceId ? <Piece id={pieceId} onDragStart={drag}/>: ''}
    </th>
  );
}

export default Square