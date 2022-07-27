class Manga{
    constructor(name, memberStr, scoreStr, members, score, image, databaseID) {
        this.name = name
        this.memberStr = memberStr
        this.scoreStr = scoreStr
        this.members = members
        this.score = score
        this.image = image
        this.databaseID = databaseID
    }
}

let fetchedManga = []

function fetchManga(mangaArr){
    let r = 0
    do {
        r = Math.round(Math.random() * 1999)
    } while (fetchedManga.includes(r))
    fetchedManga.push(r)
    return (
        new Manga( 
            mangaArr[r].name, 
            mangaArr[r].members,
            mangaArr[r].score,
            //scraped data stores members & score as strings
            parseFloat((mangaArr[r].members).replace(/,/g, '')),
            parseFloat((mangaArr[r].score).replace(/\./g, '')),
            mangaArr[r].image,
            mangaArr[r].databaseID
        )
    )
}

export {fetchedManga, fetchManga}