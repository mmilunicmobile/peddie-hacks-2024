// imports
import Card from "../Card";
import { useCallback, useEffect, useState } from "react";


interface CoolButtonProps {
    onClick: () => void
    setClick: React.Dispatch<React.SetStateAction<boolean>>
    glowColor: string
}

// creates a simple button to be used for the clicking aspect of the game
// onClick is a method to run when clicked, setClick is a value to set when space is pressed (done to mitigate closures),
// and glowColor is the color of the button so the game can change it on clicks depending on if it was correct or not to click
export default function CoolButton({ onClick, setClick, glowColor }: CoolButtonProps) {
    const [size, setSize] = useState(1);

    // makes the button grow and shrink suddenly
    const mouseDown = () => {
        onClick();
        setSize(size + .1);
        setTimeout(() => { setSize(size) }, 50);
    };

    // makes the button grow and shrink suddenly
    const keyDown = () => {
        setClick(true);
        setSize(size + .1);
        setTimeout(() => { setSize(size) }, 50);
    }

    // binds the space key to the keyDown method
    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                keyDown();
            }
        })
        // unbinds the space key if the component unmounts
        return () => {
            document.removeEventListener("keydown", (event) => {
                if (event.code === "Space") {
                    keyDown();
                }
            })
        }
    }, []);


    return (
        <div className="w-2/3 mx-auto flex-auto">
            <div className="w-full h-full py-16">
                <button className="w-full h-full" onMouseDown={mouseDown} style={{
                    transform: `scale(${size})`,

                    transition:
                        "transform 0.05s ease-out"
                }}>
                    <Card borderStyle="border-foreground">
                        <div className="w-full h-full" style={{
                            backgroundColor: glowColor,
                            transition: "background-color 0.05s ease-out",
                        }}></div>
                    </Card></button>
            </div>
        </div >
    );
}
