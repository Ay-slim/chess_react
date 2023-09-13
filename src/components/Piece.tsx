import { PieceProps } from "../types";
import '../App.css';

const Piece = (props: PieceProps) => {
  const {id, onDragStart} = props;
  console.log(id, 'piece_id')
  const src = `${id.substring(0, 2)}.png`;
  console.log(src, 'piece src')
  return (
    <img id={id} src={src} draggable={true} alt={''} onDragStart={onDragStart}/>
  );
}

export default Piece