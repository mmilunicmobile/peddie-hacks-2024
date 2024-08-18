import React, { useState } from 'react';
import { levels } from '../../constants.ts';
import '../../styles/base.css';
import Card from '../Card.jsx';

export default function WelcomeCard({ startCallback, slug, timeAmount }: { startCallback: (hard: boolean) => void, slug: string, timeAmount: number | string }) {
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
                        <h1 className="text-8xl text-center mb-8 text-white font-press-start">Welcome!</h1>
                        <p className="text-center text-lg mb-6 text-white font-press-start">Time Amount: {timeAmount} seconds</p>
                        <div className="text-center">
                            <button
                                className="start-button  text-white py-2 px-6 transition duration-300 font-press-start"
                                onClick={handleStart}
                            ><Card borderStyle="bg-blue-400 hover:bg-blue-600 border-black p-4">
                                    Start</Card>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}