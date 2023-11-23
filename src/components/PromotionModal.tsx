import '../App.css'
import { PromotedOfficialsType, PromotionProps, WebSocketMessageType } from '../types'
import { closePromotionModal, onPromotionClick } from '../logic/handlers'
import { socket } from '../logic/utils'

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
  const getPieceId = (piece: PromotionPieceType): PromotedOfficialsType => {
    const id = piece === 'Knight' ? 'n' : piece[0].toLowerCase()
    return id as PromotedOfficialsType
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
            onClick={() => {
              const opponentId = sessionStorage.getItem('opponentId')!
              const opponentMoveMessage: WebSocketMessageType = {
                srcSquareId: '',
                targetSquareId: '',
                pieceId: getPieceId(piece as PromotionPieceType), //BAD PRACTICE: pieceId here represents the first letter of the official to which the piece has been promoted. Everywhere else, it refers to the actual id of the piece that was moved which is being propagated to the opponent browser.
                opponentId,
                promotionSquaresInfo
              }
              socket.emit('validMove', opponentMoveMessage)
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
              )}
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
