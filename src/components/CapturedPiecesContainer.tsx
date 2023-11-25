import { CapturedPiecesContainerType } from "../types"

const CapturedPiecesContainer = (props: CapturedPiecesContainerType) => {
  const {
    capturedPieces
  } = props
  return (
   <div className='capturedPieces'>
    {capturedPieces.map((piece, i) => (
      <img
        id={piece}
        key={i}
        src={`${process.env.REACT_APP_BASE_URL}${piece.substring(0, 2)}.png`}
        alt={piece}
      />
    ))}
   </div>
  )
}

export default CapturedPiecesContainer