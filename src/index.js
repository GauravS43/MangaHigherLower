import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import data from "./manga_data/manga.js"
//TODO
//Work on game over screen
//work on mobile view


//% returns negative numbers
function mod(n, m) {
    return ((n % m) + m) % m
}

class Manga{
    constructor(name, memberStr, members, scoreStr, score, image) {
        this.name = name
        this.memberStr = memberStr
        this.members = members
        this.scoreStr = scoreStr
        this.score = score
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
            data.mList[r].score,
            parseFloat((data.mList[r].score).replace(/\./g, '')),
            data.mList[r].image
        )
    )
}

function StartScreen(props){

    return (
        <div className="transition_screen">
            <MangaWallpaper/>
            <h1>Manga <br></br> Higher Or Lower</h1>
            <h5>Based off The Higher or Lower Game.
                 <br></br> 
                Made in React with data web scraped from MyAnimeList in July 2022.
            </h5>
            <div className="metric_toggle">
                <button className={props.metricToggle ? "" : "selected"} onClick={() => props.setMetricToggle(false)}>
                    Popularity
                </button>
                <button className={props.metricToggle ? "selected" : ""} onClick={() => props.setMetricToggle(true)}>
                    Score
                </button>
            </div>
            <div className="button_container">
                <button onClick={props.handleClick}>Start Game</button>
            </div>
            <h4 className="credits">Made by Gaurav Sharma</h4>
        </div>
    )
}

function EndScreen(props) {
    return (
        <div className="transition_screen end">
            <div className="end"><div className="overlay"></div></div>
            <h1>Game Over</h1>
            <div className="flex">
                <h2>Final Score: {props.score}</h2>
                <h2>High Score: {props.highScore}</h2>
            </div>
            <div className="button_container">
                <button onClick={props.startGame}>Replay</button>
                <button onClick={props.returnToMenu}>Menu</button>
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
            if (props.metricToggle){
                setAniMembers(prevState => prevState + Math.round(props.mList.score/100))
            }
            else{
                setAniMembers(prevState => prevState + Math.round(props.mList.members/100))
            }
            setTimeout(() => updateAniMembers(counter += 1, higherClicked), 5)
        }
        else{
            props.metricToggle ? setAniMembers(props.mList.score) : setAniMembers(props.mList.members)
            higherClicked ? props.handleButtons(true) : props.handleButtons(false)
            //higherClicked ? props.handleHigher() : props.handleLower()
            setTimeout(reset, 1000)
        }
    }

    function handleClick(higherClicked){
        setClicked(true)
        updateAniMembers(0, higherClicked)
    }

    function commas(x) {
        if (props.metricToggle){
            return x.toString().slice(0,1) + '.' +  x.toString().slice(1)
        }
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
    return (
        <div id={props.id} className={props.style}>
            <div className="overlay"></div>
            <img src={props.mList.image} alt={props.mList.name}/>
            <div className="manga_info">
                <h1>{props.mList.name}</h1>
                <h3>{props.metricToggle ? "has a" : "has"}</h3>
                {clicked && <div className="ani_metric_text">{commas(aniMembers)}</div>}
                <div className="metric_text">
                    {props.metricToggle ? props.mList.scoreStr : props.mList.memberStr}
                </div>
                {!clicked && <div className="button_container">
                    <button onClick={() => handleClick(true)}>Higher</button>
                    <button onClick={() => handleClick(false)}>Lower</button>
                </div> }
                <h3 className="diff">{props.metricToggle ? "score" : "members"}</h3>
            </div>
        </div>
    )
}

function MangaContainer(props) {
    const [order, setOrder] = React.useState([0,1,2,3])
    const [stylePos, setStylePos] = React.useState(["manga_box position_0", "manga_box position_1", "manga_box position_2", "manga_box position_3"])
    const [mList, setMList] = React.useState([{}, fetchManga(), fetchManga(), {}])
    const [animateButton, setAnimateButton] = React.useState(false)

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

    function handleButtons(higherButton){
        if (!props.metricToggle){
            if (higherButton){
                mList[order[1]].members <= mList[order[2]].members ? handleCorrect() : props.handleLoss()
            }
            else {
                mList[order[1]].members >= mList[order[2]].members ? handleCorrect() : props.handleLoss()
            }
        }
        else{
            if (higherButton){
                mList[order[1]].score <= mList[order[2]].score ? handleCorrect() : props.handleLoss()
            }
            else {
                mList[order[1]].score >= mList[order[2]].score ? handleCorrect() : props.handleLoss()
            }
        }

    }

    return (
        <div>
            <MangaDisplay 
                id={0} 
                mList = {mList[0]}
                style = {stylePos[0]}
                current = {order[1]}
                handleButtons = {handleButtons}
                metricToggle={props.metricToggle}
            />
            <MangaDisplay 
                id={1} 
                mList = {mList[1]}
                style = {stylePos[1]}
                current = {order[1]}
                handleButtons = {handleButtons}
                metricToggle={props.metricToggle}
            />
            <MangaDisplay 
                id={2} 
                mList = {mList[2]}
                style = {stylePos[2]}
                current = {order[1]}
                handleButtons = {handleButtons}
                metricToggle={props.metricToggle}
            />
            <MangaDisplay 
                id={3} 
                mList = {mList[3]}
                style = {stylePos[3]}
                current = {order[1]}
                handleButtons = {handleButtons}
                metricToggle={props.metricToggle}
            />
            
            <button className="exit" onClick={props.handleLoss}>{"\u2715"}</button>
            <div id="middle_circle" className={animateButton ? "toDisappear" : "toAppear"}>
               <h1>VS</h1> 
            </div>
            <h4 className="highscore">High Score: {props.highScore}</h4>
            <h4 className="score">Score: {props.score}</h4>
        </div>
    )
}

function App(){
    const [appState, setAppState] = React.useState(0)
    const [score, setScore] = React.useState(0)
    const [highScore, setHighScore] = React.useState(0)
    const [metricToggle, setMetricToggle] = React.useState(false)
    
    function startGame(){
        setScore(0)
        setAppState(1)
    }

    function returnToMenu(){
        setAppState(0)
    }

    function handleLoss(){
        setTimeout(() => setAppState(2), 1000)
    }

    function updateScore(){
        setScore(prevScore => prevScore + 1)
        if (score + 1 > highScore) setHighScore(score + 1)
    }

    return(
        <div>
            {appState === 0 && <StartScreen metricToggle={metricToggle} setMetricToggle={setMetricToggle} handleClick={startGame} />}
            {appState === 1 && <MangaContainer metricToggle={metricToggle} score={score} highScore={highScore} handleLoss={handleLoss} handleScore={updateScore}/>}
            {appState === 2 && <EndScreen score={score} highScore={highScore} startGame={startGame} returnToMenu={returnToMenu}/>}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))


function MangaWallpaper(){
    const [width, setWidth] = React.useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    React.useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    const isMobile = width <= 768;

    return (
        <div className="background">
            <div className="overlay"></div>
            <MangaColumn isMobile = {isMobile}/>
            <MangaColumn isMobile = {isMobile}/>
            {!isMobile && <MangaColumn/>}
            {!isMobile && <MangaColumn/>}
            {!isMobile && <MangaColumn/>}

        </div>
    )
}

function MangaColumn(props){

    function fetchImage(){
        return data.mList[Math.round(Math.random() * 999)].image
    }

    return(
        <div className="flex">
            <div className="mangaColumn">
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                {props.isMobile && <img className="bManga" src={fetchImage()} alt="cover"/>}
                {props.isMobile && <img className="bManga" src={fetchImage()} alt="cover"/>}
            </div>
            <div className="mangaColumn" style={{marginTop: "-100px" }}>
            <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                <img className="bManga" src={fetchImage()} alt="cover"/>
                {props.isMobile && <img className="bManga" src={fetchImage()} alt="cover"/>}
                {props.isMobile && <img className="bManga" src={fetchImage()} alt="cover"/>}
            </div>
        </div>

    )
}