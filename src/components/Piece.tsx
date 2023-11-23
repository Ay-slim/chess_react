import { PieceProps } from '../types'
import '../App.css'
import { drag } from '../logic/handlers'

const Piece = (props: PieceProps) => {
  const { id, squareId, currentColor, checkMate, staleMate } = props
  const handleDrag = drag(squareId)
  const src = `${process.env.REACT_APP_BASE_URL}${id.substring(0, 2)}.png`
  const multiPlayerColor = sessionStorage.getItem('multiPlayerColor')
  const notMyTurn = multiPlayerColor && multiPlayerColor !== currentColor
  const draggable = checkMate || staleMate || notMyTurn ? false : currentColor === id[0]
  return (
    <img
      className="board-image"
      id={id}
      src={src}
      draggable={draggable}
      alt={''}
      onDragStart={handleDrag}
    />
  )
}

export default Piece
