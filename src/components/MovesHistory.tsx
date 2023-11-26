import { MovesHistoryPropType } from "../types"

const MovesHistory = (props: MovesHistoryPropType) => {
  return (
      <div className="movesHistoryContainer">
        <div className="movesHistoryTitle">Moves</div>
        <div className="nonTitleMovesHistoryItems">
        {props.moves.map((move, moveIndex) => {
          return (
          <div className="moveHistoryRow">
            <div className="moveHistoryLabel" key={moveIndex}>{moveIndex + 1}</div>
              <button className="moveHistoryButton" id={`${move[0].tracker}`}>{move[0].notation}</button>
              <button className="moveHistoryButton" id={`${move.length === 2 ? move[1].tracker : -1}`}>{move.length === 2 ? move[1].notation : ''}</button>
          </div>)
        })}
        </div>
      </div>
  )
}

export default MovesHistory