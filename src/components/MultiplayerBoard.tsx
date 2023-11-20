import { useEffect, useState } from 'react'
import Square from './Square'
import { allowDrop, onPromotionClick } from '../logic/handlers'
import {
  BoardState,
  CapturedPiecesType,
  CheckMateType,
  KingCheckType,
  KingSquareType,
  MoveHistoryType,
  OccupiedSquaresType,
  PlayerColor,
  PromotedOfficialsType,
  PromotedPiecesTrackerType,
  PromotionSquaresInfoType,
  SourceSquareAndValidMovesType,
  WebSocketMessageType,
} from '../types'
import '../App.css'
import PromotionModal from './PromotionModal'
import { executeValidMove } from '../logic/executeMove'
import { socket } from '../logic/utils' 

const MultiplayerBoard = () => {
  const [boardState, setBoardState] = useState<BoardState>({
    a1: { loc: [0, 0], piece: 'wr2' },
    b1: { loc: [1, 0], piece: 'wn2' },
    c1: { loc: [2, 0], piece: 'wb2' },
    d1: { loc: [3, 0], piece: 'wq1' },
    e1: { loc: [4, 0], piece: 'wk' },
    f1: { loc: [5, 0], piece: 'wb1' },
    g1: { loc: [6, 0], piece: 'wn1' },
    h1: { loc: [7, 0], piece: 'wr1' },
    a2: { loc: [0, 1], piece: 'wp1' },
    b2: { loc: [1, 1], piece: 'wp2' },
    c2: { loc: [2, 1], piece: 'wp3' },
    d2: { loc: [3, 1], piece: 'wp4' },
    e2: { loc: [4, 1], piece: 'wp5' },
    f2: { loc: [5, 1], piece: 'wp6' },
    g2: { loc: [6, 1], piece: 'wp7' },
    h2: { loc: [7, 1], piece: 'wp8' },
    a3: { loc: [0, 2], piece: '' },
    b3: { loc: [1, 2], piece: '' },
    c3: { loc: [2, 2], piece: '' },
    d3: { loc: [3, 2], piece: '' },
    e3: { loc: [4, 2], piece: '' },
    f3: { loc: [5, 2], piece: '' },
    g3: { loc: [6, 2], piece: '' },
    h3: { loc: [7, 2], piece: '' },
    a4: { loc: [0, 3], piece: '' },
    b4: { loc: [1, 3], piece: '' },
    c4: { loc: [2, 3], piece: '' },
    d4: { loc: [3, 3], piece: '' },
    e4: { loc: [4, 3], piece: '' },
    f4: { loc: [5, 3], piece: '' },
    g4: { loc: [6, 3], piece: '' },
    h4: { loc: [7, 3], piece: '' },
    a5: { loc: [0, 4], piece: '' },
    b5: { loc: [1, 4], piece: '' },
    c5: { loc: [2, 4], piece: '' },
    d5: { loc: [3, 4], piece: '' },
    e5: { loc: [4, 4], piece: '' },
    f5: { loc: [5, 4], piece: '' },
    g5: { loc: [6, 4], piece: '' },
    h5: { loc: [7, 4], piece: '' },
    a6: { loc: [0, 5], piece: '' },
    b6: { loc: [1, 5], piece: '' },
    c6: { loc: [2, 5], piece: '' },
    d6: { loc: [3, 5], piece: '' },
    e6: { loc: [4, 5], piece: '' },
    f6: { loc: [5, 5], piece: '' },
    g6: { loc: [6, 5], piece: '' },
    h6: { loc: [7, 5], piece: '' },
    a7: { loc: [0, 6], piece: 'bp8' },
    b7: { loc: [1, 6], piece: 'bp7' },
    c7: { loc: [2, 6], piece: 'bp6' },
    d7: { loc: [3, 6], piece: 'bp5' },
    e7: { loc: [4, 6], piece: 'bp4' },
    f7: { loc: [5, 6], piece: 'bp3' },
    g7: { loc: [6, 6], piece: 'bp2' },
    h7: { loc: [7, 6], piece: 'bp1' },
    a8: { loc: [0, 7], piece: 'br2' },
    b8: { loc: [1, 7], piece: 'bn2' },
    c8: { loc: [2, 7], piece: 'bb2' },
    d8: { loc: [3, 7], piece: 'bq1' },
    e8: { loc: [4, 7], piece: 'bk' },
    f8: { loc: [5, 7], piece: 'bb1' },
    g8: { loc: [6, 7], piece: 'bn1' },
    h8: { loc: [7, 7], piece: 'br1' },
  })
  const [currentPlayerColor, setCurrentPlayerColor] = useState<PlayerColor>('w')
  const [alertMessage, setAlertMessage] = useState('')
  const [movesHistory, setMovesHistory] = useState<MoveHistoryType[]>([])
  const [capturedPieces, setCapturedPiece] = useState<CapturedPiecesType>({
    w: [],
    b: [],
  })
  const [kingSquare, setKingSquare] = useState<KingSquareType>({
    w: 'e1',
    b: 'e8',
  })
  const [kingInCheck, setKingInCheck] = useState<KingCheckType>({
    color: null,
    validCheckMoves: {},
  })
  const [checkMate, setCheckMate] = useState<CheckMateType>(null)
  const [staleMate, setStaleMate] = useState<Boolean>(false)
  const [validMoves, setValidMoves] = useState<SourceSquareAndValidMovesType>({
    a2: { piece: 'wp1', validSquares: ['a3', 'a4'] },
    b2: { piece: 'wp2', validSquares: ['b3', 'b4'] },
    c2: { piece: 'wp3', validSquares: ['c3', 'c4'] },
    d2: { piece: 'wp4', validSquares: ['d3', 'd4'] },
    e2: { piece: 'wp5', validSquares: ['e3', 'e4'] },
    f2: { piece: 'wp6', validSquares: ['f3', 'f4'] },
    g2: { piece: 'wp7', validSquares: ['g3', 'g4'] },
    h2: { piece: 'wp8', validSquares: ['h3', 'h4'] },
    b1: { piece: 'wn2', validSquares: ['a3', 'c3'] },
    g1: { piece: 'wn1', validSquares: ['f3', 'h3'] },
  })
  //Rather than loop through the whole board when generating allThreatenedSquares or allValidMoves,
  //thought it might be a good idea to instead track all occupied squares and loop through this
  //way smaller array (16 squares at worst as opposed to 64 when looping through the whole board)
  //Pro: Faster lookup when evaluating the above
  //Con: This state has to be updated on every move as well and I'm not sure which is more efficient
  //looping through the whole board without having to update this or updating this on every move and not
  //looping through the board
  const [occupiedSquares, setOccupiedSquares] = useState<OccupiedSquaresType>({
    w: [
      'a1',
      'b1',
      'c1',
      'd1',
      'e1',
      'f1',
      'g1',
      'h1',
      'a2',
      'b2',
      'c2',
      'd2',
      'e2',
      'f2',
      'g2',
      'h2',
    ],
    b: [
      'a7',
      'b7',
      'c7',
      'd7',
      'e7',
      'f7',
      'g7',
      'h7',
      'a8',
      'b8',
      'c8',
      'd8',
      'e8',
      'f8',
      'g8',
      'h8',
    ],
  })
  const [fiftyMovesTracker, setFiftyMovesTracker] = useState<number>(0)
  const [openPromotionModal, setOpenPromotionModal] = useState<boolean>(false)
  const [promotionSquaresInfo, setPromotionSquaresInfo] =
    useState<PromotionSquaresInfoType>({ src: '', dest: '' })
  const [promotedPiecesTracker, setPromotedPiecesTracker] =
    useState<PromotedPiecesTrackerType>({ q: 1, r: 2, b: 2, n: 2 })
  const multiPlayerColor = sessionStorage.getItem('multiPlayerColor')
  const ranks = multiPlayerColor === 'w' ? ['8', '7', '6', '5', '4', '3', '2', '1'] : ['1', '2', '3', '4', '5', '6', '7', '8']
  const files = multiPlayerColor === 'w' ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a']
  const browserUuid = sessionStorage.getItem('playerId')!
  const [webSocketMessage, setWebSocketMessage] = useState<WebSocketMessageType>({
    srcSquareId: '',
    targetSquareId: '',
    pieceId: '',
    opponentId: '',
  })

  socket.on(browserUuid, (opponentMove) => {
    setWebSocketMessage(opponentMove)
  })

  useEffect(()=> {
    const {
      srcSquareId, targetSquareId, pieceId, opponentId
    } = webSocketMessage
    if (opponentId) {
      if (webSocketMessage?.promotionSquaresInfo) {
        onPromotionClick(
          fiftyMovesTracker,
          setFiftyMovesTracker,
          occupiedSquares,
          setOccupiedSquares,
          currentPlayerColor,
          setBoardState,
          webSocketMessage.pieceId as PromotedOfficialsType,
          promotedPiecesTracker,
          setPromotedPiecesTracker,
          webSocketMessage.promotionSquaresInfo,
          boardState,
          capturedPieces,
          setCapturedPiece,
          movesHistory,
          setMovesHistory,
          setCurrentPlayerColor,
          kingSquare,
          setCheckMate,
          setKingInCheck,
          setStaleMate,
          setValidMoves,
          setAlertMessage,
          setOpenPromotionModal,
        )
      } else {
        executeValidMove(
          srcSquareId,
          targetSquareId,
          pieceId,
          currentPlayerColor,
          setCurrentPlayerColor,
          boardState,
          setBoardState,
          setAlertMessage,
          movesHistory,
          setMovesHistory,
          capturedPieces,
          setCapturedPiece,
          kingSquare,
          setKingSquare,
          setKingInCheck,
          setCheckMate,
          setStaleMate,
          setValidMoves,
          occupiedSquares,
          setOccupiedSquares,
          fiftyMovesTracker,
          setFiftyMovesTracker,
          setOpenPromotionModal,
          setPromotionSquaresInfo
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webSocketMessage])

  return (
    <div>
      {openPromotionModal ? (
        <PromotionModal
          colorState={currentPlayerColor}
          setOpenPromotionModal={setOpenPromotionModal}
          fiftyMovesTracker={fiftyMovesTracker}
          occupiedSquares={occupiedSquares}
          setOccupiedSquares={setOccupiedSquares}
          promotedPiecesTracker={promotedPiecesTracker}
          setPromotedPiecesTracker={setPromotedPiecesTracker}
          promotionSquaresInfo={promotionSquaresInfo}
          currentBoard={boardState}
          setBoardState={setBoardState}
          capturedPieces={capturedPieces}
          setCapturedPieces={setCapturedPiece}
          movesHistory={movesHistory}
          setMovesHistory={setMovesHistory}
          setColorState={setCurrentPlayerColor}
          setFiftyMovesTracker={setFiftyMovesTracker}
          kingSquare={kingSquare}
          setCheckmate={setCheckMate}
          setKingInCheck={setKingInCheck}
          setStalemate={setStaleMate}
          setValidMoves={setValidMoves}
          setAlertMessage={setAlertMessage}
        />
      ) : (
        <div className="container">
          {!checkMate && !staleMate ? (
            <div className="turn">
              <p>
                Current player turn:{' '}
                <strong>{`${
                  currentPlayerColor === 'w' ? 'White' : 'Black'
                }`}</strong>
              </p>
              <p>
                |:{' '}
                <strong style={{ color: 'red' }}>
                  {kingInCheck?.color
                    ? `Check! ${
                        kingInCheck.color === 'w' ? 'White' : 'Black'
                      } king is under attack!`
                    : ''}
                </strong>
              </p>
              <p>
                |: <strong style={{ color: 'red' }}>{alertMessage}</strong>
              </p>
            </div>
          ) : (
            <div className="turn">
              <p>
                <strong style={{ color: 'red' }}>
                  {staleMate
                    ? `Stalemate! Game ends in a draw.`
                    : `Checkmate! ${
                        checkMate === 'w' ? 'White' : 'Black'
                      } wins`}
                </strong>
              </p>
            </div>
          )}
          <table className="board">
            <tbody>
              {ranks.map((row) => (
                <tr key={`row-${row}`}>
                  {files.map((col) => {
                    const id = col + row
                    return (
                      <Square
                        key={id}
                        id={id}
                        onDragOver={allowDrop}
                        pieceId={boardState[id].piece}
                        currentColor={currentPlayerColor}
                        setColor={setCurrentPlayerColor}
                        currentBoard={boardState}
                        setBoardState={setBoardState}
                        setAlertMessage={setAlertMessage}
                        movesHistory={movesHistory}
                        setMoveHistory={setMovesHistory}
                        capturedPieces={capturedPieces}
                        setCapturedPiece={setCapturedPiece}
                        kingSquare={kingSquare}
                        setKingSquare={setKingSquare}
                        kingInCheck={kingInCheck}
                        setKingInCheck={setKingInCheck}
                        checkMate={checkMate}
                        setCheckMate={setCheckMate}
                        staleMate={staleMate}
                        setStaleMate={setStaleMate}
                        validMoves={validMoves}
                        setValidMoves={setValidMoves}
                        occupiedSquares={occupiedSquares}
                        setOccupiedSquares={setOccupiedSquares}
                        fiftyMovesTracker={fiftyMovesTracker}
                        setFiftyMovesTracker={setFiftyMovesTracker}
                        setOpenPromotionModal={setOpenPromotionModal}
                        setPromotionSquaresInfo={setPromotionSquaresInfo}
                      />
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MultiplayerBoard
