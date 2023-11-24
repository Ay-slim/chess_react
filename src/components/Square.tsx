import { PlayerColor, SquareProps } from '../types'
import Piece from './Piece'
import { clickSquare, drop } from '../logic/handlers'
import '../App.css'

const Square = (props: SquareProps) => {
  const {
    id,
    onDragOver,
    pieceId,
    currentColor,
    setColor,
    currentBoard,
    setBoardState,
    setAlertMessage,
    movesHistory,
    setMoveHistory,
    capturedPieces,
    setCapturedPiece,
    kingSquare,
    setKingSquare,
    kingInCheck,
    setKingInCheck,
    checkMate,
    setCheckMate,
    staleMate,
    setStaleMate,
    validMoves,
    setValidMoves,
    occupiedSquares,
    setOccupiedSquares,
    fiftyMovesTracker,
    setFiftyMovesTracker,
    setOpenPromotionModal,
    setPromotionSquaresInfo,
    clickedSquare,
    setClickedSquare
  } = props

  const multiPlayerColor = sessionStorage.getItem('multiPlayerColor')
  const handleDrop = drop(
    currentColor,
    setColor,
    currentBoard,
    setBoardState,
    setAlertMessage,
    movesHistory,
    setMoveHistory,
    capturedPieces,
    setCapturedPiece,
    kingSquare,
    setKingSquare,
    kingInCheck,
    setKingInCheck,
    setCheckMate,
    setStaleMate,
    validMoves,
    setValidMoves,
    occupiedSquares,
    setOccupiedSquares,
    fiftyMovesTracker,
    setFiftyMovesTracker,
    setOpenPromotionModal,
    setPromotionSquaresInfo,
    multiPlayerColor as PlayerColor,
    setClickedSquare
  )
  const {
    srcSquare,
    destSquare
  } = movesHistory.length ? movesHistory[movesHistory.length - 1] : {srcSquare: 'null', destSquare: 'null'}
  const isLastMoveSrc = srcSquare === id
  const isLastMoveDest = destSquare === id
  const validMovesToCheck = kingInCheck?.color === currentColor ? kingInCheck.validCheckMoves?.[clickedSquare] : validMoves[clickedSquare]?.validSquares
  const isEligibleToMoveTo = validMovesToCheck?.includes(id)
  const hasBeenClicked = clickedSquare === id
  const handleClick = clickSquare(
    currentColor,
    pieceId,
    id,
    clickedSquare,
    setClickedSquare,
    multiPlayerColor as PlayerColor|null,
    setColor,
    currentBoard,
    setBoardState,
    setAlertMessage,
    movesHistory,
    setMoveHistory,
    capturedPieces,
    setCapturedPiece,
    kingSquare,
    setKingSquare,
    kingInCheck,
    setKingInCheck,
    setCheckMate,
    setStaleMate,
    validMoves,
    setValidMoves,
    occupiedSquares,
    setOccupiedSquares,
    fiftyMovesTracker,
    setFiftyMovesTracker,
    setOpenPromotionModal,
    setPromotionSquaresInfo,
    multiPlayerColor as PlayerColor,
    checkMate,
    staleMate
  )
  return (
    <th id={id} className={`${id} ${hasBeenClicked ? "clickedSquare" : ""} ${isLastMoveSrc ? "clickedSquare" : ""} ${isLastMoveDest ? "lastMoveDest" : ""}`} onDrop={handleDrop} onDragOver={onDragOver} onClick={handleClick}>
        {isEligibleToMoveTo ? (<div className='eligibilityCircle'></div>) : (null)}
        {pieceId ? (
          <Piece
            id={pieceId}
            currentColor={currentColor}
            squareId={id}
            checkMate={checkMate}
            staleMate={staleMate}
            setClickedSquare={setClickedSquare}
          />
        ) : (
          ''
        )}
    </th>
  )
}

export default Square
