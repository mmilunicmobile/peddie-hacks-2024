import { useEffect, useState } from "react"
import Card from "./Card"
import LeaderboardSlot from "./LeaderboardSlot"

export default function LeaderboardContents({ length, slug, borderStyle }) {
    const [people, setPeople] = useState([])
    // [
    //     { place: 1, name: 'Bob', score: "100 points" },
    //     { place: 2, name: 'Alice', score: "50 points" },
    //     { place: 3, name: 'Eve', score: "25 points" },
    // ]

    function fetchData() {
        let tempSlug;
        if (slug === "endless") {
            tempSlug = 6
        } else {
            tempSlug = slug
        }
        fetch(`http://localhost:5000/leaderboard/${tempSlug}/username`)
            .then(response => response.json())
            .then(data => {
                setPeople(data)
            });
        console.log("test");
    }

    useEffect(() => {
        fetchData()
        setTimeout(() => {
            fetchData()
        }, 3000);
    }, []);

    const output = []

    if (people.length === 0) {
        output.push(<LeaderboardSlot key={0} place={0} name={"no scores yet..."} score={""} />)
        output.push(<div></div>)
    }

    for (let i = 0; i < people.length && i < length; i++) {
        output.push(<LeaderboardSlot key={i * 2} place={i + 1} name={people[i].name} score={people[i].score} />)
        output.push(<hr key={i * 2 + 1} className={`mx-2  border-2 border-b-0 ${borderStyle}`} />)
    }

    output.pop()

    return (
        <Card borderStyle={borderStyle}>
            {output}
        </Card>
    )
}