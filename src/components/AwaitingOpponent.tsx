import '../App.css'
import { v4 as uuid } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { socket } from '../logic/utils'
import { useEffect, useState } from 'react'
import { FaCopy } from "react-icons/fa";
import LoadingSpin from "react-loading-spin";

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

  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)
  const copyToClipboard = () => {
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(gameLink).then(() => setCopiedToClipboard(true)).catch((e) => console.error(e));
    } else {
      return document.execCommand('copy', true, gameLink);
    }
  }

  return (
    <div className='awaitingContainer'>
      <div className='awaitingPageTitle'>
        <h1><strong>Basic Chess</strong></h1>
        <h4>Play, learn, live...</h4>
      </div>
      <div className='awaitingPageBody'>
        <h2><strong>You have created a new game!</strong></h2>
        <p><strong>Share the link below with anyone you would like to play with and keep this browser tab open</strong></p>
        <div className='linkWithCopy'>
          <div className='linkBox'>
            <div className='linkTextContainer'><strong>{gameLink}</strong></div>
            <div className='copyIcon' onClick={copyToClipboard}>
              <FaCopy />
            </div>
          </div>
          <div className='copyIndicator'>
            {copiedToClipboard ? <p>Copied!</p>: <p>Copy to clipboard</p>}
          </div>
        </div>
      </div>
      <div className='awaitingPageSpinner'>
        <div className='spinnerText'><h3>Waiting for your opponent to join...</h3></div>
        <div className='spinnerIcon'><LoadingSpin primaryColor='indigo'/></div>
      </div>
    </div>
  )
}

export default AwaitingOpponent