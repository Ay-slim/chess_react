import { PieceProps } from '../types';
import '../App.css';
import { drag } from '../logic/utils';

const Piece = (props: PieceProps) => {
  const {id, squareId, currentColor} = props;
  const handleDrag = drag(squareId)
  const src = `${id.substring(0, 2)}.png`;
  const draggable = currentColor === id[0];
  return (
    <img id={id} src={src} draggable={draggable} alt={''} onDragStart={handleDrag}/>
  );
}

export default Piece