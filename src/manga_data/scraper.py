import requests
import json
from bs4 import BeautifulSoup

data = []
for page in range(0, 2000, 50):
    req = requests.get(
        "https://myanimelist.net/topmanga.php?type=bypopularity&limit=" + str(page)
    )
    soup = BeautifulSoup(req.content, "html.parser")
    manga = soup.find_all("h3", {"class": "manga_h3"})
    for link in manga:
        try:
            mangaReq = requests.get(link.find("a")["href"])
            mangaSoup = BeautifulSoup(mangaReq.content, "html.parser")
            name = mangaSoup.find("span", {"itemprop": "name"})
            # Only want original title as some manga don't have localized titles
            if name.find("span", {"class": "title-english"}):
                name.find("span", {"class": "title-english"}).decompose()
            # MAL stores an id for every manga in the url
            databaseID = link.find("a")["href"][30:]
            members = mangaSoup.find("span", {"class": "numbers members"}).find(
                "strong"
            )
            image = mangaSoup.find("img", {"alt": name.text})
            score = mangaSoup.find("div", {"class": "score-label"})
            data.append(
                {
                    "name": name.text,
                    "members": members.text,
                    "score": score.text,
                    "image": image["data-src"],
                    "databaseID": databaseID[: -(len(name.text) + 1)],
                }
            )
        except:
            print("Error")
            # Only one manga results in an error as it has no images


with open("manga.json", "w") as writeJSON:
    json.dump(data, writeJSON)
