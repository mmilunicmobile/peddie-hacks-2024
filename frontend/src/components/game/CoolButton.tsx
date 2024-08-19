// imports
import Card from "../Card";
import React, { useEffect, useRef, useState } from "react";


interface CoolButtonProps {
    onClick: (e: number) => void
    time: number
    glowColor: string
    children: React.ReactNode
}

// creates a simple button to be used for the clicking aspect of the game
// onClick is a method to run when clicked, setClick is a value to set when space is pressed (done to mitigate closures),
// and glowColor is the color of the button so the game can change it on clicks depending on if it was correct or not to click
export default function CoolButton({ onClick, time, glowColor, children, }: CoolButtonProps) {
    const [size, setSize] = useState(1);

    const savedHandler = useRef(() => { });

    // makes the button grow and shrink suddenly
    useEffect(() => {
        savedHandler.current = () => {
            onClick(time);
            setSize(1.1);
            setTimeout(() => { setSize(1) }, 50);
        }
    }, [time]);

    useEffect(() => {
        const eventListener = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault();
                savedHandler.current();
            }
        }
        window.addEventListener("keydown", eventListener);
        return () => {
            window.removeEventListener("keydown", eventListener);
        }
    }, []);


    return (
        <div className="w-2/3 mx-auto flex-auto">
            <div className="w-full h-full py-16">
                <button className="w-full h-full" onMouseDown={savedHandler.current} style={{
                    transform: `scale(${size})`,

                    transition:
                        "transform 0.05s ease-out"
                }}>
                    <Card borderStyle="border-foreground bg-background">
                        <div className="w-full h-full flex" style={{
                            backgroundColor: glowColor,
                            transition: "background-color 0.05s ease-out",
                        }}><div className="m-auto text-lg">{children}</div></div>
                    </Card></button>
            </div>
        </div >
    );
}
