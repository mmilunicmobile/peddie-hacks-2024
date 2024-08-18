import { useEffect, useState } from "react"
import Card from "./Card"
import LeaderboardSlot from "./LeaderboardSlot"

// Creates a list of leaderboard entries
export default function LeaderboardContents({ length, slug, borderStyle }) {
    const [people, setPeople] = useState([])

    // Fetches leaderboard data from the backend
    function fetchData() {
        // If the mode is "endless" use id of 6 instead. This is due to a backend limitation and it is easier to fix here.
        let tempSlug;
        if (slug === "endless") {
            tempSlug = 6
        } else {
            tempSlug = slug
        }
        fetch(`https://api.letssign.xyz/leaderboard/${tempSlug}/username`)
            .then(response => response.json())
            .then(data => {
                setPeople(data)
            });
        console.log("test");
    }

    // Fetches the data again after 3 seconds that way if the user makes it to the leaderboard they can see.

    useEffect(() => {
        fetchData()
        setTimeout(() => {
            fetchData()
        }, 3000);
    }, []);

    const output = []


    // If there is noone on the leaderboard, it adds a placeholder item
    if (people.length === 0) {
        output.push(<LeaderboardSlot key={0} place={0} name={"no scores yet..."} score={""} />)
        output.push(<div></div>)
    }

    // Adds data to the leaderboard in the form of LeaderboardSlots, one for each entry
    for (let i = 0; i < people.length && i < length; i++) {
        output.push(<LeaderboardSlot key={i * 2} place={i + 1} name={people[i].name} score={people[i].score} />)
        output.push(<hr key={i * 2 + 1} className={`mx-2  border-2 border-b-0 ${borderStyle}`} />)
    }

    // Removes the last hr from the leaderboard so they are only in between entries.
    output.pop()

    return (
        <Card borderStyle={borderStyle}>
            {output}
        </Card>
    )
}