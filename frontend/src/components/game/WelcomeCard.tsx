import React, { useState } from 'react';
import { levels } from '../../constants.ts';
import '../../styles/base.css';
import Card from '../Card.jsx';

export default function WelcomeCard({ startCallback, slug, setAmount }: { startCallback: (hard: boolean) => void, slug: string, setAmount: number | string }) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isOverlayRendered, setIsOverlayRendered] = useState(true);

    const handleStart = () => {
        console.log('Start');
        setIsOverlayVisible(false);
        setTimeout(() => setIsOverlayRendered(false), 150);
        startCallback(false);
    };

    return (
        <>
            {isOverlayRendered && (
                <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition ${isOverlayVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="welcome-card w-4/5 h-3/5 max-w-full max-h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 shadow-2xl">
                        <h1 className="text-4xl text-center mb-8 text-white font-press-start">Welcome!</h1>
                        {slug === "1" && <p className="text-center text-sm mb-6 text-white font-press-start">To play, click the big button in the center to the rhythm
                            of the bar of music on the screen. The more accurate your clicks, the more points
                            you get. For every bar it will play it once for you, and then you play it by your self. If
                            you <a href="https://api.letssign.xyz/login" className="underline">login with GitHub</a>, your scores can go
                            on the leaderboard. Good luck!</p>}
                        {(slug === "2" || slug === "3" || slug === "4" || slug === "5") && <p className="text-center text-sm mb-6 text-white font-press-start">Same Rules as before, just harder rhythms.</p>}
                        {(slug === "endless") && <p className="text-center text-sm mb-6 text-white font-press-start">Now instead of a percent being your score, the time you take to die is your score. You have five mistakes before the level ends. How long can you stay alive?</p>}
                        <p className="text-center text-lg mb-6 text-white font-press-start">Bars: {setAmount}</p>
                        <div className="text-center">
                            <button
                                className="start-button  text-white py-2 px-6 transition duration-300 font-press-start"
                                onClick={handleStart}
                            ><Card borderStyle="bg-blue-400 hover:bg-blue-600 border-black p-4">
                                    Start</Card>
                            </button>
                        </div>
                    </div>
                </div >
            )
            }
        </>
    );
}