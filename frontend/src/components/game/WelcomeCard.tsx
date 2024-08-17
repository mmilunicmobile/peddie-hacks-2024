import React, { useState } from 'react';
import { levels } from '../../constants.ts';
import { useEffect } from 'react';

export default function WelcomeCard({ startCallback }: { startCallback: (hard: boolean) => void }) {
    const [timeAmount, setTimeAmount] = useState<number | string>(levels[0]?.seconds || 60);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isOverlayRendered, setIsOverlayRendered] = useState(true);

    useEffect(() => {
        const pathname = window.location.pathname;
        let levelIndex = 0;

        if (pathname.includes('/2')) {
            levelIndex = 1;
        } else if (pathname.includes('/3')) {
            levelIndex = 2;
        } else if (pathname.includes('/4')) {
            levelIndex = 3;
        } else if (pathname.includes('/5')) {
            levelIndex = 4;
        } else if (pathname.includes('/endless')) {
            levelIndex = 5;
        }

        if (levelIndex === 5) {
            setTimeAmount("∞");
        } else {
            setTimeAmount(levels[levelIndex]?.seconds || 60);
        }
    }, []);

    const handleStart = () => {
        console.log('Start');
        setIsOverlayVisible(false);
        setTimeout(() => setIsOverlayRendered(false), 500)
        startCallback(false);
    };

    return (
        <>
            {isOverlayRendered && (
                <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition ${isOverlayVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="welcome-card w-4/5 h-3/5 max-w-full max-h-full flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-8 shadow-2xl rounded-lg">
                        <h1 className="text-4xl font-bold text-center mb-4 text-white">Welcome!</h1>
                        <p className="text-center text-lg mb-6 text-white">Time Amount: {timeAmount} seconds</p>
                        <div className="text-center">
                            <button
                                className="start-button bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition duration-300"
                                onClick={handleStart}
                            >
                                Start
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}