import Card from "../Card";
import { useCallback, useEffect, useState } from "react";


interface CoolButtonProps {
    onClick: () => void
    setClick: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CoolButton({ onClick, setClick }: CoolButtonProps) {
    const [size, setSize] = useState(1);

    const mouseDown = () => {
        onClick();
        setSize(size + .1);
        setTimeout(() => { setSize(size) }, 50);
    };

    const keyDown = () => {
        setClick(true);
        setSize(size + .1);
        setTimeout(() => { setSize(size) }, 50);
    }

    useEffect(() => {
        document.addEventListener("keydown", (event) => {
            if (event.code === "Space") {
                keyDown();
            }
        })
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
                    <Card borderStyle="border-foreground bg-background">
                        <div></div>
                    </Card></button>
            </div>
        </div >
    );
}
