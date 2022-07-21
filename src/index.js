import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import data from "./manga.js"
//Things to do
//Finalize design (font size, background Images)
//publish website
//Add credits
//Change members into rating

//% returns negative numbers
function mod(n, m) {
    return ((n % m) + m) % m
}

class Manga{
    constructor(name, memberStr, members, image) {
        this.name = name
        this.memberStr = memberStr
        this.members = members
        this.image = image
    }
}

function fetchManga(){
    let r = Math.round(Math.random() * 999)
    return (
        new Manga( 
            data.mList[r].name, 
            data.mList[r].members,
            //data stores members as a string with commas
            parseFloat((data.mList[r].members).replace(/,/g, '')), 
            data.mList[r].image
        )
    )
}

function StartScreen(props){
    const [metricToggle, setMetricToggle] = React.useState(false)

    return (
        <div className="transition_screen">
            <MangaWallpaper/>
            <h1>Manga Higher Or Lower</h1>
            <h5>A game based off The Higher or Lower Game.
                 <br></br> 
                Made in React with data web scraped from MyAnimeList in July 2022.
            </h5>
            <div className="metric_toggle">
                <button className={metricToggle ? "" : "selected"} onClick={() => setMetricToggle(false)}>
                    Popularity
                </button>
                <button className={metricToggle ? "selected" : ""} onClick={() =>  setMetricToggle(true)}>
                    Score
                </button>
            </div>
            <div className="button_container">
                <button onClick={props.handleClick}>Start Game</button>
            </div>
            <h5 className="credits">Made by Gaurav Sharma</h5>
        </div>
    )
}

function EndScreen(props) {
    return (
        <div className="transition_screen">
            <div className="end"><div className="overlay"></div></div>
            <h1>Game Over</h1>
            <h2>Final Score: {props.score}</h2>
            <h2>High Score: {props.highScore}</h2>
            <div className="button_container">
                <button onClick={props.handleClick}>Replay</button>
            </div>
        </div>
    )
}

function MangaDisplay(props) {
    //var that animates, clicked shows components
    const [aniMembers, setAniMembers] = React.useState(0)
    const [clicked, setClicked] = React.useState(false)

    function reset(){
        setClicked(false)
        setAniMembers(0)
    }

    function updateAniMembers(counter, higherClicked){
        if (counter < 100){
            setAniMembers(prevState => prevState + Math.round(props.mList.members/100))
            setTimeout(() => updateAniMembers(counter += 1, higherClicked), 5)
        }
        else{
            setAniMembers(props.mList.members)
            higherClicked ? props.handleHigher() : props.handleLower()
            setTimeout(reset, 1000)
        }
    }

    function handleClick(higherClicked){
        setClicked(true)
        updateAniMembers(0, higherClicked)
    }

    function commas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
    return (
        <div id={props.id} className={props.style}>
            <div className="overlay"></div>
            <img src={props.mList.image} alt={props.mList.name}/>
            <div className="manga_info">
                <h1>{props.mList.name}</h1>
                <h3>has</h3>
                {clicked && <div className="ani_metric_text">{commas(aniMembers)}</div>}
                <div className="metric_text">{props.mList.memberStr}</div>
                {!clicked && <div className="button_container">
                    <button onClick={() => handleClick(true)}>Higher</button>
                    <button onClick={() => handleClick(false)}>Lower</button>
                </div> }
                <h3>Members</h3>
            </div>
        </div>
    )
}

function MangaContainer(props) {
    //Might be possible to combine order and stylePos
    //order should be turned into a modular var not an arr
    const [order, setOrder] = React.useState([0,1,2,3])
    const [stylePos, setStylePos] = React.useState(["manga_box position_0", "manga_box position_1", "manga_box position_2", "manga_box position_3"])
    const [mList, setMList] = React.useState([{}, fetchManga(), fetchManga(), {}])


    //still wip
    const [animateButton, setAnimateButton] = React.useState(false)

    //still wip

    function determineNewManga(prevMList){
        let mangaArr = prevMList
        mangaArr[mod(order[3], 4)] = fetchManga()
        return mangaArr
    }

    function handleLogic(){
        props.handleScore()
        setOrder(prevOrder => prevOrder.slice(1).concat(prevOrder[0]))
        setStylePos(prevStyles => [prevStyles[3]].concat(prevStyles.slice(0,3)))
        setMList(prevMList => determineNewManga(prevMList))
        setAnimateButton(false)
    }

    function handleCorrect(){
        setAnimateButton(true)
        setTimeout(handleLogic, 1000)
    }

    //See if you can put this into one button
    function higherPressed(){
        mList[order[1]].members <= mList[order[2]].members ? handleCorrect() : props.handleLoss()
    }

    function lowerPressed(){
        mList[order[1]].members >= mList[order[2]].members ? handleCorrect() : props.handleLoss()
    }

    return (
        <div>
            <MangaDisplay 
                id={0} 
                mList = {mList[0]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[0]}
                current = {order[1]}
            />
            <MangaDisplay 
                id={1} 
                mList = {mList[1]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[1]}
                current = {order[1]}
            />
            <MangaDisplay 
                id={2} 
                mList = {mList[2]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[2]}
                current = {order[1]}
            />
            <MangaDisplay 
                id={3} 
                mList = {mList[3]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[3]}
                current = {order[1]}
            />
            
            <div id="middle_circle" className={animateButton ? "toDisappear" : "toAppear"}>
               <h1>VS</h1> 
            </div>
            <h5 className="highscore">High Score: {props.highScore}</h5>
            <h5 className="score">Score: {props.score}</h5>
        </div>
    )
}

function App(){
    const [appState, setAppState] = React.useState(0)
    const [score, setScore] = React.useState(0)
    const [highScore, setHighScore] = React.useState(0)

    function startGame(){
        setScore(0)
        setAppState(1)
    }

    function handleLoss(){
        setTimeout(gameOver, 1000)
    }

    function gameOver(){
        setAppState(2)
    }

    function updateScore(){
        setScore(prevScore => prevScore + 1)
        if (score + 1 > highScore) setHighScore(score + 1)
    }

    return(
        <div>
            {appState === 0 && <StartScreen handleClick={startGame}/>}
            {appState === 1 && <MangaContainer score={score} highScore={highScore} handleLoss={handleLoss} handleScore={updateScore}/>}
            {appState === 2 && <EndScreen score={score} highScore={highScore} handleClick={startGame}/>}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))


function MangaWallpaper(){
    return (
        <div className="background">
            <div className="overlay"></div>
            <MangaColumn/>
            <MangaColumn/>
            <MangaColumn/>
            <MangaColumn/>
            <MangaColumn/>

        </div>
    )
}

function MangaColumn(){
    return(
        <div className="flex">
            <div className="mangaColumn">
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
            </div>
            <div className="mangaColumn" style={{marginTop: "-100px" }}>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
                <img className="bManga" src={data.mList[Math.round(Math.random() * 999)].image} alt="cover"/>
            </div>
        </div>

    )
}