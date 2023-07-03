import React from "react"
import ReactDOM from "react-dom"
import axios from 'axios'
import './index.css'
import { StartScreen } from './startScreen.js'
import { EndScreen } from './endScreen.js'
import { GameScreen } from './gameScreen.js'

function App() {
    const [appState, setAppState] = React.useState(0)
    const [score, setScore] = React.useState(0)
    const [highScore, setHighScore] = React.useState(0)
    const [metricToggle, setMetricToggle] = React.useState(false)
    //difficulty changes number of possible manga (100, 1000, 2000)
    const [numManga, setNumManga] = React.useState(100)

    function startGame() {
        setScore(0)
        setAppState(2)
    }

    function returnToMenu() {
        setAppState(1)
    }

    //delay needed for incrementing metric animation to finish
    function handleLoss() {
        setTimeout(() => setAppState(3), 1000)
    }

    function updateScore() {
        setScore(prevScore => prevScore + 1)
        if (score + 1 > highScore) setHighScore(score + 1)
    }

    function changeDifficulty(buttonID) {
        if (buttonID === 0) { setNumManga(100) }
        else if (buttonID === 1) { setNumManga(1000) }
        else { setNumManga(1999) }
    }

    const [mData, setMData] = React.useState(null)
    React.useEffect(() => {
        axios.get("https://gauravs43.pythonanywhere.com/")
            .then(res => {
                setMData(res.data)
                setAppState(1)
            })
    }, [])

    return (
        <div className={appState !== 3 ? "wrapper" : ""}>
            {appState === 0 && <div className="loading"></div>}
            {appState === 1 && <StartScreen mData={mData} metricToggle={metricToggle} numManga={numManga} setMetricToggle={setMetricToggle} changeDifficulty={changeDifficulty} handleClick={startGame} />}
            {appState === 2 && <GameScreen mData={mData} metricToggle={metricToggle} score={score} highScore={highScore} numManga={numManga} handleLoss={handleLoss} handleScore={updateScore} />}
            {appState === 3 && <EndScreen mData={mData} score={score} highScore={highScore} startGame={startGame} returnToMenu={returnToMenu} />}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))