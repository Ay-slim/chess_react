import '../App.css'
import { PromotionProps } from '../types'
import { closePromotionModal, onPromotionClick } from '../logic/handlers'

const PromotionModal = (props: PromotionProps) => {
  const {
    colorState,
    setOpenPromotionModal,
    fiftyMovesTracker,
    occupiedSquares,
    setOccupiedSquares,
    promotedPiecesTracker,
    setPromotedPiecesTracker,
    promotionSquaresInfo,
    currentBoard,
    setBoardState,
    capturedPieces,
    setCapturedPieces,
    movesHistory,
    setMovesHistory,
    setColorState,
    setFiftyMovesTracker,
    kingSquare,
    setCheckmate,
    setKingInCheck,
    setStalemate,
    setValidMoves,
    setAlertMessage,
  } = props
  type PromotionPieceType = 'Bishop' | 'Knight' | 'Rook' | 'Queen'
  const pieces = ['Bishop', 'Knight', 'Rook', 'Queen']
  const getPieceId = (piece: PromotionPieceType): 'b' | 'n' | 'q' | 'r' => {
    const id = piece === 'Knight' ? 'n' : piece[0].toLowerCase()
    return id as 'b' | 'n' | 'q' | 'r'
  }
  return (
    <div className="prom-container">
      <h2 className="prom-text">
        One of your pawns made it outta the trenches!
      </h2>
      <p className="prom-text">
        Which official would you like to promote it to?
      </p>
      <p className="prom-text">(Click on your desired piece)</p>
      <div className="prom-images-container">
        {pieces.map((piece, index) => (
          <div
            id={getPieceId(piece as PromotionPieceType)}
            key={index}
            className="prom-image-item"
            onClick={() =>
              onPromotionClick(
                fiftyMovesTracker,
                setFiftyMovesTracker,
                occupiedSquares,
                setOccupiedSquares,
                colorState,
                setBoardState,
                getPieceId(piece as PromotionPieceType),
                promotedPiecesTracker,
                setPromotedPiecesTracker,
                promotionSquaresInfo,
                currentBoard,
                capturedPieces,
                setCapturedPieces,
                movesHistory,
                setMovesHistory,
                setColorState,
                kingSquare,
                setCheckmate,
                setKingInCheck,
                setStalemate,
                setValidMoves,
                setAlertMessage,
                setOpenPromotionModal
              )
            }
          >
            <img
              src={`${colorState}${getPieceId(
                piece as PromotionPieceType
              )}.png`}
              alt={piece}
            />
            <p>{piece}</p>
          </div>
        ))}
      </div>
      <button
        className="prom-close-button"
        onClick={closePromotionModal(setOpenPromotionModal)}
      >
        Return to board
      </button>
    </div>
  )
}

export default PromotionModal
