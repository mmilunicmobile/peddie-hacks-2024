import CardInset from "../CardInset.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import React from "react";
import WelcomeCard from "./WelcomeCard.tsx";
import { HealthBar, ScoreBar } from "./ScoreBars.tsx";
import MusicDisplay from "./MusicDisplay.tsx";
import CoolButton from "./CoolButton.tsx";
import EndCard from "./EndCard.tsx";
import { backendURL, timingTolerance } from "../../constants.ts";
import { Howl, Howler } from 'howler';

interface GameComponentProps {
    borderStyle: string
    slug: string
    name: string
    timeAmount: number
    timeDisplay?: string | number
    setCount: number
}

export default function GameComponent(props: GameComponentProps) {

    // gets the level index
    const levelIndex = props.slug;

    // gets the border style for the card
    const borderStyle = props.borderStyle;

    // creates the states for the scoring
    let [greenProportion, setGreenProportion] = useState(0.0);
    let [redProportion, setRedProportion] = useState(0.0);
    let lastHealthDifference = useRef(0.0);
    let [health, setHealth] = useState(1.0);

    let startTime = useRef(0.0);

    // creates the states for the time
    let [time, setTime] = useState(0.0);

    // creates the states for the difficulty (to be integrated in a future version)
    const [hard, setHard] = useState(false);

    // creates the states for the countdown and image (what to show in the image display)
    const [countdown, setCountdown] = useState("");
    const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

    // if the game is in endless mode makes a boolean for that
    const endless = props.slug === "endless";

    // a ref for wether the user should be able to clap at the moment
    const clapLocked = useRef(true);

    // which set the user is on
    const [setNumber, setSetNumber] = useState(-1);

    // the object which contains all the data to display the next bar
    const [nextSet, setNextSet] = useState<SetObject | null>(null);

    // the object which contains all the data to display the current bar
    const [currentSet, setCurrentSet] = useState<SetObject | null>(null);

    // if the game should end
    const [isFinished, setIsFinished] = useState(false);

    // the scores of each note in the current set (true, null, or false for eacj note depending on if it was hit or not)
    const [thisSetTimes, setThisSetTimes] = useState<number[][]>([[]]);

    // the timings of the notes in the current bar relative to time
    const [timings, setTimings] = useState<number[][]>([]);

    // the current tempo
    const [componentTempo, setComponentTempo] = useState(60);

    // a bunch of ids to be able to kill the note not played timeout
    const [timingKillers, setTimingKillers] = useState<number[]>([]);

    // a ref to kill the timer when the round ends
    const [timeKill, setTimeKill] = useState(0);

    // a ref to wether a key is down or not (passed to button)
    const [kedIsDown, setKedIsDown] = useState(false);

    // keeps preloaded images in memory so they are not unloaded
    const imageRefs = useRef<(HTMLImageElement)[]>([]);

    // the color of the button
    const [glow, setGlow] = useState("#fbfbfe");

    // if it is the computer's turn
    const [computerTurn, setComputerTurn] = useState("");

    // the sound effects
    let baseSound = useRef<Howl | null>(null);
    let midSound = useRef<Howl | null>(null);
    let chordSound = useRef<Howl | null>(null);
    let clapSound = useRef<Howl | null>(null);
    let bellSound = useRef<Howl | null>(null);

    // a function to delay execution
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        // Disable scrolling
        document.body.style.overflow = "hidden";

        //Should re-enable defaults once component is unmounted
        return () => {
            document.body.style.overflow = "";
        }
    }, []);


    // loads the sounds
    useEffect(() => {
        const createHowl = (src: string[], format?: string[]) => new Howl({
            src: src,
            onloaderror: (e, f) => { console.log("error loading " + src + " " + f) },
            onload: () => {
                console.log("loaded " + src);
            },
            format: format
        });
        baseSound.current = createHowl(['/music/base.mp3']);
        midSound.current = createHowl(['/music/mid.mp3']);
        chordSound.current = createHowl(['/music/chord.mp3']);
        // m4a is cuz safari doesnt like the mp3s for some reason
        clapSound.current = createHowl(['/music/clap.m4a', "/music/clap.mp3",]);
        bellSound.current = createHowl(['/music/bell.m4a', "/music/clap.mp3"]);
    }, []);


    // starts the game
    const startCallback = async () => {
        await delay(300);
        requestNextSet(undefined).then((nextSet) => {
            setNextSet(nextSet);
        })
        scheduleBeats(60, [midSound, midSound, midSound, chordSound], []);
        setCountdown("1");
        await delay(1000);
        setCountdown("2");
        await delay(1000);
        setCountdown("Ready...");
        await delay(1000);
        setCountdown("Play!");
        await delay(1000);
        startTime.current = Date.now();
        setTimeKill(setInterval(() => {
            setTime(() => (Date.now() - startTime.current) / 1000);
        }, 10));
        setSetNumber((i) => i + 1);
    }

    // Makes a request to the server to get the next set
    const requestNextSet = async function (tempo: number | undefined) {
        //console.log(backendURL);
        let tempIndex = levelIndex;
        if (tempIndex === "endless") {
            tempIndex = "6";
        }
        const result = await fetch(backendURL + `/api/set/level/${tempIndex}/?` + new URLSearchParams({
            setNumber: (setNumber + 1).toString(),
            time: time.toString()
        }));
        const json = await result.json();
        //console.log(json);

        // example of json schema
        // {
        //     tempo: 60,
        //     rhythm: [0, 0.25, 0.5, 0.75,
        //         1, 1.25, 1.5, 1.75, 2.00,
        //         2.25, 2.5, 2.75, 3,
        //         3.25, 3.5, 3.75],
        //     src: "/images/testMusic.svg"
        // }
        json.src = backendURL + "/api/set/image/?" + new URLSearchParams({
            q: json.src
        });

        // preloads the image
        var img = new Image();
        img.src = json.src;
        imageRefs.current.push(img);
        //console.log(setNumber + 1, tempo ? time + (60 / tempo * 8) : time)

        return json;
    };

    // makes a clap sound
    function makeClap() {
        clapSound.current!.stop();
        clapSound.current?.play();
        // console.log(clapSound.current?.state());
        // console.log("Clap!")
    }

    function makeBell() {
        bellSound.current!.stop();
        bellSound.current?.play();
        // console.log(bellSound.current?.state());
        // console.log("Bell!")
    }

    // schedules beats based on the tempo, the beat types, and what times there should be claps
    function scheduleBeats(tempo: number, counts: React.MutableRefObject<Howl | null>[], beats: number[]) {
        const timeBetweenBeats = (60 / tempo) * 1000;
        const beatLength = 0.5 * timeBetweenBeats;

        // schedules the counts
        for (let i = 0; i < counts.length; i++) {
            setTimeout(() => {
                counts[i].current?.play();
            }, timeBetweenBeats * i);
            setTimeout(() => {
                counts[i].current?.stop();
            }, timeBetweenBeats * i + beatLength);
        }

        // schedules the claps
        for (let i = 0; i < beats.length; i++) {
            setTimeout(() => {
                makeBell();
            }, timeBetweenBeats * beats[i]);
        }
    }

    // keeps track of if the user has died in endless mode
    useEffect(() => {
        if (health <= 0.01 && endless) {
            clearInterval(timeKill);
            setIsFinished(true);
        }
    }, [health])

    // sets up the next set when the number changes
    useEffect(() => {
        (async () => {
            if (setNumber === -1) {
                return;
            };
            if (!endless && setNumber + 1 > props.setCount) {
                setIsFinished(true);
                //console.log("Finished");
                return;
            } else if (endless && health <= 0) {
                setIsFinished(true);
                //console.log("Finished");
                return;
            }
            setCurrentSet(nextSet);
            const response = await requestNextSet(nextSet?.tempo);
            setNextSet(response);
        })()
    }, [setNumber])


    // when the actual set content changes, it fills out all the proper info for it ands schedules the beats
    useEffect(() => {
        (async () => {
            if (currentSet) {
                await runSet(currentSet);
                setThisSetTimes((thisSetTimes) => [...thisSetTimes, []]);
                setSetNumber(i => i + 1);
            }
        })();

    }, [currentSet])


    interface SetObject {
        src: string,
        rhythm: number[],
        tempo: number,
    }

    // runs a set
    async function runSet(setObject: SetObject, startTime?: number) {
        // calculates the time between beats
        const timeBetweenBeats = (60 / setObject.tempo) * 1000;

        setComponentTempo(setObject.tempo);
        setTimings((timings) => [...timings, setObject.rhythm.map((r) => time + (60 / setObject.tempo * (r + 4)))]);

        // if the mode is hard does not play the claps
        if (!hard) {
            scheduleBeats(setObject.tempo, [chordSound, baseSound, baseSound, baseSound, chordSound, baseSound, baseSound, baseSound], setObject.rhythm);
        } else {
            scheduleBeats(setObject.tempo, [chordSound, baseSound, baseSound, baseSound, chordSound, baseSound, baseSound, baseSound], []);
        }

        //sets the image
        setImageSrc(setObject.src);

        //sets clap lock timing for rehythm preview
        clapLocked.current = true;
        setTimeout(() => { clapLocked.current = false }, timeBetweenBeats * 3.5);
        setComputerTurn("Computer's turn...");
        await delay(timeBetweenBeats * 4);
        setComputerTurn("Your turn!");
        await delay(timeBetweenBeats * 4);
    }

    // makes the button change color depending on the change in score
    const displayCoolChange = (change: number) => {
        //console.log("Cool change: " + change);
        if (change > 0) {
            setGlow("green");
            setTimeout(() => { setGlow("white") }, 100);
        } else if (change < 0) {
            setGlow("red");
            setTimeout(() => { setGlow("white") }, 100);
        }
    }

    useEffect(() => {
        const currentDifference = greenProportion - redProportion;
        const changeInDif = currentDifference - lastHealthDifference.current;
        displayCoolChange(changeInDif);
        lastHealthDifference.current = currentDifference;
    }, [redProportion, greenProportion])


    // stop the music when the game ends
    useEffect(() => {
        if (isFinished) {
            clapSound.current!.volume(0);
            baseSound.current!.volume(0);
            chordSound.current!.volume(0);
            midSound.current!.volume(0);
            bellSound.current!.volume(0);
        }
    }, [isFinished])


    const myClickMan = useCallback(() => {
        if (!clapLocked.current) {
            setThisSetTimes((times) => [...times.slice(0, -1), [...(times[times.length - 1]), time]]);
            makeClap();
        }
    }, [time])

    function updateScoreCalculations(userTimesAll: number[][], correctTimesAll: number[][]) {
        if (!currentSet) {
            return;
        }
        try {

            let totalIncorrectCount = 0;
            let totalCorrectCount = 0;

            for (let bar = 0; bar < userTimesAll.length && bar < correctTimesAll.length; bar++) {
                const userTimes = userTimesAll[bar];
                const correctTimes = correctTimesAll[bar];
                const beats: (boolean | null)[] = correctTimes.map((t) => null);
                let incorrectCount = 0;
                let correctCount = 0;

                if (correctTimes.length === 0) {
                    if (userTimes.length > 0) {
                        incorrectCount = 1;
                    } else {
                        correctCount = 1;
                    }
                } else {
                    for (let i = 0; i < userTimes.length; i++) {
                        const timingDiffs = correctTimes.map((t) => {
                            return Math.abs(userTimes[i] - t)
                        });
                        const min = Math.min(...timingDiffs);
                        const index = timingDiffs.indexOf(min);
                        const correct = min <= timingTolerance;
                        if (correct) {
                            if (beats[index] === null) {
                                beats[index] = true;
                            } else {
                                beats[index] = false;
                            }
                        } else {
                            // console.log("Wrong: " + userTimes[i] + " " + correctTimes[index]);
                            beats[index] = false;
                        }
                    }

                    let maxIndexScored = -1;

                    correctTimes.forEach((t, i) => {
                        if ((t + timingTolerance) < time || beats[i] !== null) {
                            maxIndexScored = i;
                        }
                    });

                    for (let i = 0; i <= maxIndexScored; i++) {
                        if (beats[i] === true) {
                            correctCount++;
                        } else {
                            incorrectCount++;
                        }
                    }

                    if (!endless) {
                        incorrectCount /= correctTimes.length;
                        correctCount /= correctTimes.length;
                    } else {
                        // just leave them be
                    }
                }

                if (!endless) {
                    totalIncorrectCount += incorrectCount / props.setCount;
                    totalCorrectCount += correctCount / props.setCount;
                } else {
                    totalIncorrectCount += incorrectCount;
                    totalCorrectCount += correctCount;
                }
            }
            if (!endless) {
                setRedProportion(totalIncorrectCount);
                setGreenProportion(totalCorrectCount);
            } else {
                setRedProportion(totalIncorrectCount);
                setGreenProportion(totalCorrectCount);
                setHealth(1 - totalIncorrectCount / 5);
            }
            // console.log(totalIncorrectCount, totalCorrectCount);
        } catch (e) {
            console.log(e);
        }
    }

    // useEffect(() => {
    //     console.log("player times: ", thisSetTimes);
    // }, [thisSetTimes])

    // useEffect(() => {
    //     console.log("timings: ", timings);
    // }, [timings])

    useEffect(() => updateScoreCalculations(thisSetTimes, timings), [time])

    // the component
    return (
        <div className={`w-full h-full font-press-start`}>
            <div className="m-4 h-full">
                <div className="w-full h-4/5">
                    <CardInset borderStyle={borderStyle.split(' ')[0] + " bg-white "}>
                        {!isFinished ? <>
                            <WelcomeCard startCallback={(hard) => { startCallback() }} slug={levelIndex} setAmount={endless ? "Infinite" : props.setCount} /><MusicDisplay countdown={countdown} src={imageSrc} />
                            <div className="m-4 space-y-4 flex flex-col h-full">
                                <CoolButton onClick={myClickMan} time={time} glowColor={glow}>{computerTurn}</CoolButton>
                                <div className="flex-none">
                                    {levelIndex === "endless" ? (
                                        <HealthBar health={health} time={time} />
                                    ) : (
                                        <ScoreBar greenProportion={greenProportion} redProportion={redProportion} />
                                    )}</div>
                            </div>
                        </> : <EndCard slug={levelIndex} score={!endless ? (greenProportion * 100) : time} />}
                    </CardInset>
                </div>
            </div>
        </div>
    );
}