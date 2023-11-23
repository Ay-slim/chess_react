import '../App.css'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const navigate = useNavigate()
  const navigateToSinglePlayer = () => navigate('/single')
  const navigateToAwaitingPage = () => navigate('/awaiting')

  return (
    <div className='mainContainer'>
      <div className='mainPageTitle'>
        <h1><strong>Basic Chess</strong></h1>
        <h3><strong>Play, learn, live...</strong></h3>
      </div>
      <div className='features'>
        <div className='featureContainer'>
          <div className='featureCard multiplayerCard' onClick={navigateToAwaitingPage}>
            <h1><strong>Multiplayer</strong></h1>
            <div className='multiplayerDescription'><p><strong>Create a game and get a shareable link to invite a friend to play</strong></p></div>
          </div>
          <div className='featureCard singleplayerCard' onClick={navigateToSinglePlayer}>
            <h1><strong>Singleplayer</strong></h1>
            <div className='singleplayerDescription'><p><strong>Play a game against yourself</strong></p></div>
          </div>
        </div>
      </div>
      <div className='comingSoonTitle'><h1><strong>Coming Soon</strong></h1></div>
      <div className='featureContainer comingSoon'>
        <div className='comingSoonCard'>
          <h1><strong>Play against an AI</strong></h1>
          <p><strong>We'll pit you against our cyber overlords and see how that goes</strong></p>
          <div className='ai'></div>
        </div>
        <div className='comingSoonCard'>
          <h1><strong>Chaos board and notes</strong></h1>
          <p><strong>The perfect chess study tool</strong></p>
          <div className='note'>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage