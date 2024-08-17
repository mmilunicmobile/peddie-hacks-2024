import CardInset from "../CardInset.jsx";
import { useEffect, useRef, useState } from "react";
import WelcomeCard from "./WelcomeCard.tsx";
import { HealthBar, ScoreBar } from "./ScoreBars.tsx";
import MusicDisplay from "./MusicDisplay.tsx";
import CoolButton from "./CoolButton.tsx";

interface GameComponentProps {
    borderStyle: string
    slug: string
    name: string
    timeAmount: number | string
}

export default function GameComponent(props: GameComponentProps) {

    const levelIndex = props.slug;

    const borderStyle = props.borderStyle;

    let [greenProportion, setGreenProportion] = useState(0.0);
    let [redProportion, setRedProportion] = useState(0.0);
    let [health, setHealth] = useState(1.0);

    let [time, setTime] = useState(0.0);

    const [mode, setMode] = useState(0);

    let baseSound = useRef<HTMLAudioElement | null>(null);
    let midSound = useRef<HTMLAudioElement | null>(null);
    let chordSound = useRef<HTMLAudioElement | null>(null);
    let clapSound = useRef<HTMLAudioElement | null>(null);


    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = "hidden";

        //Should re-enable defaults once component is unmounted
        return () => {
            document.body.style.overflow = "";
        }
    }, []);

    useEffect(() => {
        baseSound.current = new Audio('/music/base.mp3');
        midSound.current = new Audio('/music/mid.mp3');
        chordSound.current = new Audio('/music/chord.mp3');
        clapSound.current = new Audio('/music/clap.mp3');
    }, []);


    const startCallback = () => {
        setInterval(() => {
            setTime((t) => t + 0.02);
        }, 20);
    }

    function makeClap() {
        clapSound.current!.currentTime = 0;
        clapSound.current?.play();
    }


    function scheduleBeats(tempo: number, beats: number[]) {
        const timeBetweenBeats = (60 / tempo) * 1000;
        const beatLength = 0.5 * timeBetweenBeats;

        const counts = [chordSound, baseSound, chordSound, midSound, chordSound, baseSound, chordSound, midSound]
        for (let i = 0; i < counts.length; i++) {
            setTimeout(() => {
                counts[i].current?.play();
            }, timeBetweenBeats * i);
            setTimeout(() => {
                counts[i].current?.pause();
                if (counts[i].current) {
                    counts[i].current!.currentTime = 0;
                }
            }, timeBetweenBeats * i + beatLength);
        }
        for (let i = 0; i < beats.length; i++) {
            setTimeout(() => {
                makeClap();
            }, timeBetweenBeats * beats[i]);
        }
    }



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
                        <WelcomeCard startCallback={(hard) => { startCallback() }} slug={levelIndex} timeAmount={props.timeAmount} /><MusicDisplay />
                        <div className="m-4 space-y-4 flex flex-col h-full">
                            <CoolButton onClick={() => { scheduleBeats(60, [0, 1, 2, 2.5, 3, 3.5]) }} />
                            <div className="flex-none">
                                {levelIndex === "endless" ? (
                                    <HealthBar health={1} time={time} />
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