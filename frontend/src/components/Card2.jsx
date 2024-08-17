import React from 'react';

const Card2 = ({ title, description }) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 m-4">
            <h3 className="text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-700">{description}</p>
        </div>
    );
};

export default Card2;