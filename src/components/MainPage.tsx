import '../App.css'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const navigate = useNavigate()
  const navigateToSinglePlayer = () => navigate('/single')
  const navigateToAwaitingPage = () => navigate('/awaiting')

  return (
    <div className='mainContainer'>
    <div className='mainPageTitle'>
      <h1>Basic Chess</h1>
      <h4>The game you love. With the people you love.</h4>
    </div>
      <div className='platform'>
        <div className='features'>
          <div className='multiplayerCard' onClick={navigateToAwaitingPage}>
              <div className='multiplayerImg'>
                <img className='img-size' src={`${process.env.REACT_APP_BASE_URL}People.png`} alt='multiplayer'/>
              </div>
              <h1>Multiplayer</h1>
          </div>
          <div className='singleplayerCard' onClick={navigateToSinglePlayer}>
            <div className='singleplayerImg'>
              <img className='img-size' src={`${process.env.REACT_APP_BASE_URL}Person.png`}  alt='singlePlayer'/>
            </div>
            <h1>Singleplayer</h1>
          </div>
        </div>
        <div className='featureContainer comingSoon'>
          <p><strong>Coming soon</strong></p>
          <div className='comingSoonCard'>
            <img className='img-size' src={`${process.env.REACT_APP_BASE_URL}AI.png`} alt="artificial dumbness" />
            <h1><strong>Play with AI</strong></h1>
          </div>
          <div className='comingSoonCard'>
            <img className='img-size' src={`${process.env.REACT_APP_BASE_URL}chaos.png`} alt="Chaos" />
            <h1><strong>Chaos board</strong></h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage