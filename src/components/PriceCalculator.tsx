'use client';

import React, { useState } from 'react';

const PriceCalculator = () => {
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [price, setPrice] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('/api/calculate-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ width, height }),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate price');
            }

            const data = await response.json();
            setPrice(data.price);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Price Calculator</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="width">Width</label>
                    <input
                        type="number"
                        id="width"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="height">Height</label>
                    <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {price !== null && <p className="text-green-500 mb-4">Price: €{price}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Calculate
                </button>
            </form>
        </div>
    );
};

export default PriceCalculator;