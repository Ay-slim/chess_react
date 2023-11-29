import MainPage from './components/MainPage'
import Board from './components/Board'
import AwaitingOpponent from './components/AwaitingOpponent'
import MultiplayerBoard from './components/MultiplayerBoard'
import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' Component={MainPage} />
        <Route path='/single' Component={Board} />
        <Route path='/awaiting' Component={AwaitingOpponent} />
        <Route path='/multiboard' Component={MultiplayerBoard} />
        <Route path='/multi/:gameIds' Component={MultiplayerBoard} />
      </Routes>
      <Analytics/>
    </>
  )
}

export default App
