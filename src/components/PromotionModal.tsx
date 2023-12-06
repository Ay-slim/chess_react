import '../App.css'
import { PromotedOfficialsType, PromotionProps, WebSocketMessageType } from '../types'
import { onPromotionClick } from '../logic/handlers'
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
    movesNotation,
    setMovesNotation
  } = props
  type PromotionPieceType = 'Bishop' | 'Knight' | 'Rook' | 'Queen'
  const pieces = ['Bishop', 'Knight', 'Rook', 'Queen']
  const multiPlayerColor = sessionStorage.getItem('multiPlayerColor')
  const getPieceId = (piece: PromotionPieceType): PromotedOfficialsType => {
    const id = piece === 'Knight' ? 'n' : piece[0].toLowerCase()
    return id as PromotedOfficialsType
  }
  return (
      <div className={multiPlayerColor ? "prom-images-container-multi" : "prom-images-container"}>
        {pieces.map((piece, index) => (
          <div
            id={getPieceId(piece as PromotionPieceType)}
            key={index}
            className="prom-image-item"
            onClick={() => {
              if (multiPlayerColor) {
                const opponentId = sessionStorage.getItem('opponentId')!
                const opponentMoveMessage: WebSocketMessageType = {
                  srcSquareId: '',
                  targetSquareId: '',
                  pieceId: getPieceId(piece as PromotionPieceType), //BAD PRACTICE: pieceId here represents the first letter of the official to which the piece has been promoted. Everywhere else, it refers to the actual id of the piece that was moved which is being propagated to the opponent browser.
                  opponentId,
                  promotionSquaresInfo
                }
                socket.emit('validMove', opponentMoveMessage)
              }
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
                setOpenPromotionModal,
                movesNotation,
                setMovesNotation
              )}
            }
          >
            <img
              src={`${process.env.REACT_APP_BASE_URL}${colorState}${getPieceId(
                piece as PromotionPieceType
              )}.png`}
              alt={piece}
            />
            <p>{piece}</p>
          </div>
        ))}
      </div>
  )
}

export default PromotionModal
