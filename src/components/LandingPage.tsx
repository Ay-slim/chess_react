import { useNavigate } from "react-router-dom"
import { Link } from "react-scroll"

const LandingPage = () => {
  const navigate = useNavigate()
  const navigateToMainPage = () => navigate('/home')

  return (
    <div className="landingPageContainer">
      <div className="landingPageNavBar">
        <div className="landingPageNavBarLinks">
          <a href="https://github.com/Ay-slim/chess_react" target="_blank" rel="noreferrer" ><img className="landingPageImages" src={`${process.env.REACT_APP_BASE_URL}githubicon.png`} alt="github"></img></a>
          <Link activeClass="landingPageFeatures" to="landingPageFeatures" spy smooth offset={-130} className="linkStyle"><strong>Features</strong></Link>
          <Link activeClass="landingPageAbout" to="landingPageAbout" spy smooth offset={-130} className="linkStyle"><strong>About</strong></Link>
        </div>
        <div className="landingPageTitle">
          <h1>Video Chess</h1>
          <h4>Online chess... but in person!</h4>
        </div>
        <div className="landingPageCta">
          <button onClick={() => {navigateToMainPage()}}>Play now</button>
        </div>
      </div>
      <div className="landingPageMainImg">
        <img src={`${process.env.REACT_APP_BASE_URL}landingBgImg.png`} className="landingPageImages" alt="Game demo"></img>
      </div>
      <section id="landingPageFeatures">
        <h2>Features</h2>
        <div className="lPAsingPlayerContainer">
          <div className="lPAsingImg">
            <img src={`${process.env.REACT_APP_BASE_URL}singlePlayerIllstr.png`} className="landingPageImages" alt="Single player demo"></img>
          </div>
          <div className="lPAsingText">
            <h3>Singleplayer</h3>
            <p><strong>Play against yourself:</strong></p>
            <ul>
              <li>Recreate your favorite games</li>
              <li>Test out gambits</li>
              <li>Perfect your strategy</li>
            </ul>
          </div>
        </div>
        <div className="lPAmultiPlayerContainer">
          <div className="lPAmultiImg">
            <img src={`${process.env.REACT_APP_BASE_URL}landingBgImg.png`} className="landingPageImages" alt="Multi player demo"></img>
          </div>
          <div className="lPAmultiText">
            <h3>Multiplayer</h3>
            <p><strong>Play against a friend you can see and speak with:</strong></p>
            <ul>
              <li>No signups or ratings, just play and hang out</li>
              <li>Toggle video and audio on/off, it's up to you</li>
              <li>Review moves and history after the game ends</li>
            </ul></div>
        </div>
      </section>
      <section id="landingPageAbout">
        <h2>About</h2>
        <p>
          Video Chess didn't start out as video chess. It was the result of a Whatsapp conversation with Nimi Williams (a close friend and ex-colleague) at the end of January 2023 about side projects and he mentioned writing chess logic from scratch in Python.
          I got intrigued, cloned the <a href="https://github.com/WilliamsNimi/Chess_Logic" target="_blank" rel="noreferrer" >repo</a>, and made an initial pull request. That was the beginning of a collaboration that lasted over a month during which we implemented most chess rules (except draw conditions) as a CLI/terminal application and experimented with different approaches to make the core logic work.
        </p>
        <div><img className="landingPageImages" src={`${process.env.REACT_APP_BASE_URL}cliIllstr.png`} alt="CLI illustration"></img></div>
        <p>After making it work reliably, we paused contributing to that repo to concentrate on other stuff but we had frequent conversations about cleaning up the code, adding proper documentation and even a full rewrite</p>
        <p>Having worked mostly as a backend developer, I'd always been interested in React and even took a few tutorials, but never really built anything on my own with it asides contributing to existing projects at work. In September, it occurred to me that building a UI for the chess logic would be a great React project. In addition, I was midway into the <a target="_blank" rel="noreferrer"  href="https://www.alxafrica.com/">ALX Africa software engineering program</a> and I also figured it would be a great portfolio project.
          I began work on rewriting the core python logic in React.js with Typescript. It took a little longer than the one month we spent in January/February as I had to brush up on some concepts and figure out the styling. By the end of October, I had finished the rewrite including the missing chess draw/stalemate rules but all in a single player format where you could only play against yourself.
        </p>
        <div><img className="landingPageImages" src={`${process.env.REACT_APP_BASE_URL}initialBoard.png`} alt="Initial board"></img></div>
        <p>After getting it to this point, there was another pause to focus on a really busy period in the ALX program as well as work on some other stuff. Mid November was when we were scheduled at ALX to start work on the portfolio project MVP, and I began working on building out the multiplayer feature and setting up websocket infrastructure to communicate moves. It was while working on this I had the brainwave that a video calling feature would be nice to have.</p>
        <p>It's been a brutally challenging but fulfilling journey and I'm thankful to Nimi, David, Akin, Zara, Amama, Yokossi, Ann, and all the other folks who helped with inspiration, guidance, and feedback.</p>
      </section>
    </div>
  )
}

export default LandingPage