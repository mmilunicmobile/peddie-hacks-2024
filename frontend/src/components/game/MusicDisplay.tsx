
import { useEffect, useState } from "react";

interface MusicDisplayProps {
    src?: string,
    countdown?: string
}

export default function MusicDisplay({ src, countdown = "1" }: MusicDisplayProps) {
    return (
        src ? <div className="flex-none">
            <img src={src} className="h-32 mt-16 mx-auto" />
        </div> : <div className="flex-none h-32 mt-16 text-center flex text-7xl font-semibold"><div className="my-auto mx-auto">{countdown}</div></div>
    )
}

