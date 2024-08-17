import Card from "./Card"
import LeaderboardSlot from "./LeaderboardSlot"

export default function LeaderboardContents({ slug, borderStyle }) {
    const people = [
        { place: 1, name: 'Bob', score: "100 points" },
        { place: 2, name: 'Alice', score: "50 points" },
        { place: 3, name: 'Eve', score: "25 points" },
    ]

    const output = [];

    for (let i = 0; i < people.length; i++) {
        output.push(<LeaderboardSlot key={people[i].name} place={people[i].place} name={people[i].name} score={people[i].score} />)
        output.push(<hr className={`mx-2  border-2 border-b-0 ${borderStyle}`} />)
    }

    output.pop()

    return (
        <Card borderStyle={borderStyle}>
            {output}
        </Card>
    )
}