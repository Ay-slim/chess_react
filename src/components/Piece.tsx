import { PieceProps } from '../types'
import '../App.css'
import { drag } from '../logic/handlers'

const Piece = (props: PieceProps) => {
  const { id, squareId, currentColor, checkMate, staleMate } = props
  const handleDrag = drag(squareId)
  const src = `${id.substring(0, 2)}.png`
  const draggable = checkMate || staleMate ? false : currentColor === id[0]
  return (
    <img 
      className='board-image'
      id={id}
      src={src}
      draggable={draggable}
      alt={''}
      onDragStart={handleDrag}
    />
  )
}

export default Piece
