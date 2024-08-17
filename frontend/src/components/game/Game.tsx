import CardInset from "../CardInset.jsx";
import { useEffect, useState } from "react";
import WelcomeCard from "./WelcomeCard.tsx";
import { HealthBar, ScoreBar } from "./ScoreBars.tsx";
import MusicDisplay from "./MusicDisplay.tsx";
import CoolButton from "./CoolButton.tsx";

interface GameComponentProps {
    borderStyle: string
    slug: string
    name: string
}

export default function GameComponent(props: GameComponentProps) {

    const levelIndex = props.slug;

    const borderStyle = props.borderStyle;

    let [greenProportion, setGreenProportion] = useState(0.0);
    let [redProportion, setRedProportion] = useState(0.0);
    let [health, setHealth] = useState(1.0);

    const [mode, setMode] = useState(0);

    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = "hidden";

        //Should re-enable defaults once component is unmounted
        return () => {
            document.body.style.overflow = "";
        }
    }, []);

    const handleGreenProportionChange = (newProportion: number) => {
        setGreenProportion(newProportion);
    };

    const handleRedProportionChange = (newProportion: number) => {
        setRedProportion(newProportion);
    };

    return (
        <div className="w-full h-full">
            <div className="m-4 h-full">
                <div className="w-full h-4/5">
                    <CardInset borderStyle={`${borderStyle}`}>
                        <WelcomeCard startCallback={(hard) => { }} /><MusicDisplay />
                        <div className="m-4 space-y-4 flex flex-col h-full">
                            <CoolButton onClick={() => { console.log("clicked") }} />
                            <div className="flex-none">
                                {levelIndex === "endless" ? (
                                    <HealthBar health={1} />
                                ) : (
                                    <ScoreBar greenProportion={greenProportion} redProportion={redProportion} />
                                )}</div>
                        </div>
                        {/* <button onClick={() => handleGreenProportionChange(greenProportion + 0.1)}>Add 10 green?</button>
                        <button onClick={() => handleRedProportionChange(redProportion + 0.1)}>Add 10 red?</button> */}
                    </CardInset>
                </div>
            </div>
        </div>
    );
}