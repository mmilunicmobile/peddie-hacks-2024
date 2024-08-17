export default function LeaderboardSlot({ place, name, score }) {
    return (
        <div className="flex m-4 space-x-4">
            <div className="flex-none text-2xl font-bold my-auto">{place}.</div>
            <div className="flex-none my-auto text-lg font-medium">{name}</div>
            <div className="flex-auto"></div>
            <div className="flex-none my-auto font-semibold text-xl">{score}</div>
        </div>
    )
}
