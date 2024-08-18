import Card from "../Card";
import { levels } from '../../constants.ts';
import { useEffect, useState } from "react";

interface ScoreBarProps {
    greenProportion: number
    redProportion: number
}

// creates the default scoring bar
export function ScoreBar(props: ScoreBarProps) {
    // gets the green and red portions of the score
    const { greenProportion, redProportion } = props;

    // finds what text to display for the green and red portions
    const greenDisplayText = Math.round(greenProportion * 100) + "%";
    const redDisplayText = 100 - Math.round((1 - redProportion) * 100) + "%";

    // creates the score bar
    return (
        <div className="w-full h-12">
            <Card borderStyle="border-foreground bg-background">
                <div className="flex h-full bg-gray-200">
                    <div className="h-full overflow-visible text-left flex-none transition-all flex" style={
                        {
                            width: `${greenProportion * 100}%`,
                        }}>
                        <span className="my-auto text-2xl font-bold text-black z-10 flex-none w-0"><span className="ml-2">{greenDisplayText}</span></span>
                        <div className="bg-green-600 z-0 flex-auto"></div>
                    </div>
                    <div className=" h-full flex-auto"
                    ></div>
                    <div className="h-full overflow-visible text-left flex-none transition-all flex" style={
                        {
                            width: `${redProportion * 100}%`,
                            direction: "rtl",
                        }}>
                        <span className="my-auto text-2xl font-bold text-black z-10 flex-none w-0"><span className="mr-2">{redDisplayText}</span></span>
                        <div className="bg-red-600 z-0 flex-auto"></div>
                    </div>
                </div>
            </Card >
        </div >
    )
}

interface HealthBarProps {
    health: number
    time: number
}

// creates the scoring bar used in endless mode
export function HealthBar(props: HealthBarProps) {
    const { health, time } = props;

    // sets the width to be the health of the player and sets the percent of the bar to be the health
    const greenDisplayText = Math.round(health * 100) + "%";
    const displayTime = Math.round(time * 10) / 10;

    // basically just a div that makes the bar look like a health bar
    return (
        <div className="w-full h-12 flex">
            <Card borderStyle="border-foreground bg-background">
                <div className="flex h-full bg-gray-200">
                    <div className="text-2xl font-bold text-black z-10 absolute left-0 right-0 top-0 bottom-0 m-auto text-center">{greenDisplayText}</div>
                    <div className="h-full overflow-visible text-left flex-none transition-all flex" style={
                        {
                            width: `${health * 100}%`,
                        }}>

                        <div className="bg-red-600 z-0 flex-auto"></div>
                    </div>
                    <div className=" h-full flex-auto"
                    ></div>

                </div>
            </Card >
            <div className="text-2xl font-bold text-black flex-none my-auto mx-4 min-w-28 text-right font-mono">{displayTime.toFixed(1)} s</div>
        </div >
    )
}