import '../App.css'
import { useNavigate } from 'react-router-dom'
import { socket } from '../logic/utils'
import { useEffect, useState } from 'react'
import { FaCopy } from "react-icons/fa";
import LoadingSpin from "react-loading-spin";
import { PlayerColor } from '../types'

const AwaitingOpponent = () => {
  const navigate = useNavigate()
  const navigateToMultiBoard = () => navigate('/multiboard')
  const [opponentJoined, setOpponentJoined] = useState<string>('')

  const [gameLink, setGameLink] = useState<string>('')
  const selectColor = (color: PlayerColor) => {
    sessionStorage.setItem('playerId', socket.id)
    sessionStorage.setItem('multiPlayerColor', color)
    setGameLink(`${process.env.REACT_APP_BASE_URL}multi/${socket.id}+${color}`)
  }

  socket.on(`joinedGame`, (opponentId: string) => {
    sessionStorage.setItem('opponentId', opponentId)
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
    <>
    {!gameLink ? 
    <div className='colorSelectionModal'>
      <div className='colorSelectionCopy'><strong>What color would you like to play as?</strong></div>
      <div className='colorButtonsContainer'><div className='whiteColorButton' onClick={()=>selectColor('w')}>White</div><div className='blackColorButton' onClick={()=>selectColor('b')}>Black</div></div>
    </div> :
    <div className='awaitingContainer'>
      <div className='awaitingPageTitle'>
        <h1><strong>Video Chess</strong></h1>
        <h4>Experience chess differently</h4>
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
    }
    </>
  )
}

export default AwaitingOpponent