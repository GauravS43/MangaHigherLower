import React from "react"
import { fetchedManga } from "./MangaObj"

function EndScreen(props) {
    const lastManga = fetchedManga[fetchedManga.length - 1]
    
    return (
        <div className="transition_screen end">
            <div className="end"><div className="overlay"></div></div>
            <h1>Game Over</h1>
            <h5>Learn more about
                <br></br>
                <a target={"_blank"} rel="noreferrer" href={"https://myanimelist.net/manga/".concat(props.mData[lastManga].databaseID)}>{props.mData[lastManga].name}</a>
            </h5>
            <div className="flex">
                <h2>Final Score: {props.score}</h2>
                <h2>High Score: {props.highScore}</h2>
            </div>
            <div className="button_container">
                <button onClick={props.startGame}>Replay</button>
                <button onClick={props.returnToMenu}>Menu</button>
            </div>
            <h4 className="credits">Made by <a target={"_blank"} rel="noreferrer" href="https://github.com/GauravS43/manga_higher_lower">Gaurav Sharma</a></h4>
        </div>
    )
}

export {EndScreen}