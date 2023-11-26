import { handlePostGameClick } from "../logic/utils"
import { MovesHistoryPropType } from "../types"

const MovesHistory = (props: MovesHistoryPropType) => {
  const {
    moves,
    stalemate,
    checkmate,
    setPostGameTracker,
    setBoardState,
    gameMovesHistory
  } = props

  return (
      <div className="movesHistoryContainer">
        <div className="movesHistoryTitle">Moves</div>
        <div className="nonTitleMovesHistoryItems">
        {moves.map((move, moveIndex) => {
          return (
          <div className="moveHistoryRow">
            <button className="moveHistoryLabel" key={`${move[0].tracker}-label`} disabled={true}>{moveIndex + 1}</button>
              <button className="moveHistoryButton" key={`${move[0].tracker}`} id={`${move[0].tracker}`} disabled={!(stalemate || checkmate)} onClick={()=>handlePostGameClick(setPostGameTracker, setBoardState, move[0].tracker, gameMovesHistory)}>{move[0].notation}</button>
              <button className="moveHistoryButton" key={`${move[0].tracker}-sec`} id={`${move.length === 2 ? move[1].tracker : -1}`} disabled={!(stalemate || checkmate)} onClick={()=>handlePostGameClick(setPostGameTracker, setBoardState, move.length === 2 ? move[1].tracker : -1, gameMovesHistory)}>{move.length === 2 ? move[1].notation : ''}</button>
          </div>)
        })}
        </div>
      </div>
  )
}

export default MovesHistory