import Card from "../Card";
import { levels } from '../../constants.ts';
import { useEffect, useState } from "react";

interface ScoreBarProps {
    greenProportion: number
    redProportion: number
}

export function ScoreBar(props: ScoreBarProps) {
    const { greenProportion, redProportion } = props;

    const greenDisplayText = Math.round(greenProportion * 100) + "%";

    const redDisplayText = 100 - Math.round((1 - redProportion) * 100) + "%";

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
}

export function HealthBar(props: HealthBarProps) {
    const { health } = props;

    const greenDisplayText = Math.round(health * 100) + "%";

    return (
        <div className="w-full h-12">
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
        </div >
    )
}