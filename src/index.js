import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import mList from "./manga_data/manga.js"

//default mod returns negative num
function mod(n, m) {
    return ((n % m) + m) % m
}

class Manga{
    constructor(name, memberStr, scoreStr, members, score, image) {
        this.name = name
        this.memberStr = memberStr
        this.scoreStr = scoreStr
        this.members = members
        this.score = score
        this.image = image
    }
}

function fetchManga(){
    let r = Math.round(Math.random() * 999)
    return (
        new Manga( 
            mList[r].name, 
            mList[r].members,
            mList[r].score,
            //scraped data stores members & score as strings
            parseFloat((mList[r].members).replace(/,/g, '')),
            parseFloat((mList[r].score).replace(/\./g, '')),
            mList[r].image
        )
    )
}

function MangaColumn(props){
    function fetchImage(){
        return mList[Math.round(Math.random() * 999)].image
    }

    return(
        <div className="flex">
            <div className="manga_column">
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                {props.isMobile && <img className="bg_manga" src={fetchImage()} alt="cover"/>}
            </div>
            <div className="manga_column" style={{marginTop: props.isMobile ? "" : "-100px"}}>
            <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                <img className="bg_manga" src={fetchImage()} alt="cover"/>
                {props.isMobile && <img className="bg_manga" src={fetchImage()} alt="cover"/>}
            </div>
        </div>

    )
}

function MangaWallpaper(){
    const [width, setWidth] = React.useState(window.innerWidth);
    const isMobile = (width <= 768);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    React.useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

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
    //var that animates metric, clicked shows components
    const [aniMetric, setAniMetric] = React.useState(0)
    const [clicked, setClicked] = React.useState(false)

    function reset(){
        setClicked(false)
        setAniMetric(0)
    }

    var animate = (metric) => setAniMetric(prevState => prevState + Math.round(metric/100))

    function updateAniMetric(counter, higherClicked){
        if (counter < 100){
            props.metricToggle ? animate(props.mList.score) : animate(props.mList.members)
            setTimeout(() => updateAniMetric(counter += 1, higherClicked), 5)
        }
        else{
            props.metricToggle ? setAniMetric(props.mList.score) : setAniMetric(props.mList.members)
            higherClicked ? props.handleButtons(true) : props.handleButtons(false)
            setTimeout(reset, 1000)
        }
    }

    function handleClick(higherClicked){
        setClicked(true)
        updateAniMetric(0, higherClicked)
    }

    function interpret(x) {
        if (props.metricToggle) return x.toString().slice(0,1) + '.' +  x.toString().slice(1)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
    return (
        <div id={props.id} className={props.style.concat(" manga_box")}>
            <div className="overlay"></div>
            <img src={props.mList.image} alt={props.mList.name}/>
            <div className="manga_info">
                <h1>{props.mList.name}</h1>
                <h3>{props.metricToggle ? "has a" : "has"}</h3>
                {clicked && <div className="ani_metric_text">{interpret(aniMetric)}</div>}
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
    const [stylePos, setStylePos] = React.useState(["pos_0", "pos_1", "pos_2", "pos_3"])
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

    function checkMetric(){
        if (props.metricToggle) return (mList[order[1]].score <= mList[order[2]].score)
        return (mList[order[1]].members <= mList[order[2]].members)
    }

    function handleButtons(higherButton){
        higherButton ? (checkMetric() ? handleCorrect() : props.handleLoss()) : (checkMetric() ? props.handleLoss() : handleCorrect())
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
            <div id="middle_circle" className={animateButton ? "to_disappear" : "to_appear"}>
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

    //delay needed for incrementing metric animation to finish
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