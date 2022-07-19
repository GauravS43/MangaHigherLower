import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import data from "./manga.js"
//Things to do
//add a way to make sure the same manga doesn't come again
//Finalize design (font size, background Images)
//publish website
//Add credits
//Change members into rating



//% returns negative numbers
function mod(n, m) {
    return ((n % m) + m) % m;
}

class Manga{
    constructor(name, membersStr, membersNum, image) {
        this.name = name
        this.membersNum = membersNum
        this.membersStr = membersStr
        this.image = image
    }
}

function fetchManga(){
    let r = Math.round(Math.random() * 199);
    return (
        new Manga( 
            data.mList[r].name, 
            data.mList[r].members, 
            parseFloat((data.mList[r].members).replace(/,/g, '')), 
            data.mList[r].image
        )
    )
}

function StartScreen(props){
    return (
        <div className="transition_screen">
            <h1>Manga Higher Or Lower</h1>
            <div className="button_container">
                <button onClick={props.handleClick}>Start Game</button>
            </div>
        </div>
    )
}

function EndScreen(props) {
    return (
        <div className="transition_screen">
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
    const [aniMembers, setAniMembers] = React.useState(0)
    const [clicked, setClicked] = React.useState(false)
    let counter = 0

    //name parameter higherpressed?
    function updateAniMembers(){
        if (counter < props.mList.membersNum){
            setClicked(true)
            setAniMembers(prevState => prevState + Math.round(props.mList.membersNum/100))
            setTimeout(updateAniMembers, 5)
            counter += Math.round(props.mList.membersNum/100)
        }
        else{
            props.handleHigher()
        }
    }

    function updateAniMembers2(){
        if (counter < props.mList.membersNum){
            setClicked(true)
            setAniMembers(prevState => prevState + Math.round(props.mList.membersNum/100))
            setTimeout(updateAniMembers2, 5)
            counter += Math.round(props.mList.membersNum/100)
        }
        else{
            props.handleLower()
        }
    }

    function commas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function reset() {
        setClicked(false)
        counter = 0
        setAniMembers(0)
    }
    
    return (
        <div id={props.id} className={props.style}>
            <div className="overlay"></div>
            <img src={props.mList.image} alt="mangaImage"/>
            <div className="manga_info">
                <h1>{props.mList.name}</h1>
                <h3>has</h3>
                {clicked && <h2>{commas(aniMembers)}</h2>}
                {!clicked && <div className="button_container">
                    <button onClick={updateAniMembers}>Higher</button>
                    <button onClick={updateAniMembers2}>Lower</button>
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
    const [currentManga, setCurrentManga] = React.useState(1)
    const [stylePos, setStylePos] = React.useState(["manga_box position_0", "manga_box position_1", "manga_box position_2", "manga_box position_3"])
    const [mList, setMList] = React.useState([{}, fetchManga(), fetchManga(), {}])


    //still wip
    const [animateTest, setAnimateTest] = React.useState(false)

    function determineNewManga(prevState){
        let mangaArr = prevState
        mangaArr[mod(currentManga + 2, 4)] = fetchManga()
        return mangaArr
    }

    function handleLogic(){
        props.handleScore()
        setOrder(prevState => prevState.slice(1).concat(prevState[0]))
        setStylePos(prevState => [prevState[3]].concat(prevState.slice(0,3)))
        setCurrentManga(prevState => mod(prevState + 1, 4))
        setMList(prevState => determineNewManga(prevState))
        setAnimateTest(false)
    }

    function handleCorrect(){
        setAnimateTest(true)
        setTimeout(handleLogic, 1000)
    }

    //See if you can put this into one button
    function higherPressed(){
        mList[order[1]].membersNum <= mList[order[2]].membersNum ? handleCorrect() : props.handleLoss()
    }

    function lowerPressed(){
        mList[order[1]].membersNum >= mList[order[2]].membersNum ? handleCorrect() : props.handleLoss()
    }

    return (
        <div>
            <MangaDisplay 
                id={0} 
                mList = {mList[0]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[0]}
                current = {currentManga}
            />
            <MangaDisplay 
                id={1} 
                mList = {mList[1]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[1]}
                current = {currentManga}
            />
            <MangaDisplay 
                id={2} 
                mList = {mList[2]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[2]}
                current = {currentManga}
            />
            <MangaDisplay 
                id={3} 
                mList = {mList[3]}
                handleHigher = {higherPressed}
                handleLower = {lowerPressed}
                style = {stylePos[3]}
                current = {currentManga}
            />
            
            <div id="middle_circle" className={animateTest ? "toDisappear" : "toAppear"}></div>
            <div id="middle" className={animateTest ? "toDisappear" : "toAppear"}>VS</div>
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

    function gameOver(){
        setAppState(2)
    }

    function updateScore(){
        setScore(prevState => prevState + 1)
        if (score + 1 > highScore) setHighScore(score + 1)
    }

    return(
        <div>
            {appState === 0 && <StartScreen handleClick={startGame}/>}
            {appState === 1 && <MangaContainer score={score} highScore={highScore} handleLoss={gameOver} handleScore={updateScore}/>}
            {appState === 2 && <EndScreen score={score} highScore={highScore} handleClick={startGame}/>}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))