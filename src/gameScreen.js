import React from "react"
import {fetchManga} from './MangaObj.js'

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

function GameScreen(props) {
    const [order, setOrder] = React.useState([0,1,2,3])
    const [stylePos, setStylePos] = React.useState(["pos_0", "pos_1", "pos_2", "pos_3"])
    const [mList, setMList] = React.useState([{}, {}, {}, {}])
    const [animateButton, setAnimateButton] = React.useState(false)

    //Inital fetchManga() is only called when first started
    React.useEffect(() => {
        setMList([{}, fetchManga(props.mData), fetchManga(props.mData), {}])
    }, [props.mData]);

    function determineNewManga(prevMList){
        let mangaArr = prevMList
        //more accurate mod arithmetic done with order[3] % 4
        mangaArr[((order[3] % 4) + 4) % 4] = fetchManga(props.mData)
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
        <div className="container">
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
            <h4 className="credits">Data sourced from <a target={"_blank"} rel="noreferrer" href="https://myanimelist.net/topmanga.php?type=bypopularity">MyAnimeList</a></h4>
        </div>
    )
}

export {GameScreen}