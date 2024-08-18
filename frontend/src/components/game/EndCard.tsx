/*
Your score was: {score}

leaderboard

Click here to play again
*/

import React, { useState, useEffect } from 'react';
import { levels } from '../../constants.ts';
import '../../styles/base.css';
import Card from '../Card.jsx';
import LeaderboardContents from '../LeaderboardContents.jsx';

function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export default function EndCard({ score, slug }: { score: string, slug: string }) {

    useEffect(() => {
        console.log('EndCard component rendered');

        const userid = getCookie('user_id') || 0; // Default to 0 if not found
        const username = getCookie('username') || 'string'; // Default to 'string' if not found
        const token = getCookie('jwt') || '';
        console.log(userid, username)

        // Send the POST request
        fetch(`http://localhost:5000/postscore/${slug}?token=${token}&score=${score}`, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    const handleReload = () => {
        console.log('Button clicked, reloading');
        window.location.reload();
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full h-full flex flex-col justify-center bg-white p-8 shadow-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                <div className="flex flex-col xl:flex-row space-y-4 xl:space-y-0">
                    <div className="flex flex-col text-center flex-1 space-y-8 mx-auto">
                        <h1 className="text-2xl font-bold text-white font-press-start">Your Score</h1>
                        <p className="text-4xl text-blue-700 font-press-start">{score}{slug === 'endless' ? ' s' : '%'}</p>
                        <a
                            href=""
                            className="text-blue-700 font-semibold font-press-start w-fit mx-auto"
                        ><Card
                            borderStyle="border-blue-700 bg-white hover:bg-blue-700 hover:text-white"
                        ><div className="py-2 px-4">Press to Play Again</div></Card
                            ></a
                        >
                    </div>
                    <div className="flex-1 flex flex-col text-center mx-12 space-y-8">
                        <h2 className="text-xl font-semibold text-white font-press-start">Leaderboard</h2>
                        <a href={`/leaderboard/${slug}`} className="max-w-md mx-auto"><LeaderboardContents length={3} slug={slug} borderStyle="border-blue-700 bg-white" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}