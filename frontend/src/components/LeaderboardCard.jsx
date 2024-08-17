import Card from "./Card"
import LeaderboardSlot from "./LeaderboardSlot"

export default function LeaderboardCard({ }) {
    const people = [
        { place: 1, name: 'Bob', score: "100 points" },
        { place: 2, name: 'Alice', score: "50 points" },
        { place: 3, name: 'Eve', score: "25 points" },
    ]

    const output = [];

    for (let i = 0; i < people.length; i++) {
        output.push(<LeaderboardSlot key={people[i].name} place={people[i].place} name={people[i].name} score={people[i].score} />)
        output.push(<hr className="mx-2 border-primary border-2 border-b-0" />)
    }

    output.pop()

    return (
        <Card>
            {output}
        </Card>
    )
}