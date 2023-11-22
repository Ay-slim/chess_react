import '../App.css'
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { socket } from '../logic/utils'
import { useEffect, useState } from 'react'

const AwaitingOpponent = () => {
  const navigate = useNavigate()
  const navigateToMultiBoard = () => navigate('/multiboard')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gameIds, _] = useState<{
    playerId: string;
    opponentId: string;
  }>({playerId: uuid(), opponentId: uuid()}) //https://stackoverflow.com/questions/62153510/how-to-prevent-uuid-from-changing-state-when-using-copy-to-clipboard-function
  sessionStorage.setItem('playerId', gameIds.playerId)
  sessionStorage.setItem('opponentId', gameIds.opponentId)
  sessionStorage.setItem('multiPlayerColor', 'w')
  const gameLink = `${process.env.REACT_APP_BASE_URL}multi/${gameIds.playerId}+${gameIds.opponentId}`
  const [opponentJoined, setOpponentJoined] = useState<string>('')
  socket.on(`${gameIds.playerId}-joined`, () => {
    setOpponentJoined('Una papa, I don land!')
  })

  useEffect(() => {
    if (opponentJoined)
      navigateToMultiBoard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opponentJoined])

  return (
    <div>
      <div className='mainPageTitle'>
        <h1>Railway Chess</h1>
        <h4>Play, learn, live...</h4>
      </div>
      <div>
        <h2>You have created a new game!</h2>
        <p><strong>Share the link below with anyone you would like to play with and keep this browser tab open!</strong></p>
        <p>Link: {gameLink}</p>
      </div>
      <div>
        <p>Waiting for your opponent to join</p>
      </div>
    </div>
  )
}

export default AwaitingOpponent