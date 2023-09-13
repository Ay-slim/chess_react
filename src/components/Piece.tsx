import { PieceProps } from "../types";
import '../App.css';

const Piece = (props: PieceProps) => {
  const {id, onDragStart, currentColor} = props;
  const src = `${id.substring(0, 2)}.png`;
  const draggable = currentColor === id[0];
  return (
    <img id={id} src={src} draggable={draggable} alt={''} onDragStart={onDragStart}/>
  );
}

export default Piece