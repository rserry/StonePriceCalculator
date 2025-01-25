'use client';

import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import type { Rectangle } from '@/types';

const PriceCalculator = () => {
    const [rectangles, setRectangles] = useState<Rectangle[]>([{ width: 0, height: 0 }]);
    const [prices, setPrices] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState(null);
    const [error, setError] = useState('');

    const handleRectangleChange = (index: number, field: keyof Rectangle, value: string) => {
        const newRectangles = [...rectangles];
        newRectangles[index][field] = Number(value);
        setRectangles(newRectangles);
    };

    const handleAddRectangle = () => {
        setRectangles([...rectangles, { width: 0, height: 0 }]);
    };

    const handleRemoveRectangle = (index: number) => {
        const newRectangles = rectangles.filter((_, i) => i !== index);
        setRectangles(newRectangles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setPrices([]);

        try {
            const responses = await fetch('/api/calculate-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rectangles),
            });

            const data = await responses.json();
            setPrices(data.prices);
            setTotalPrice(data.totalPrice);
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
                {rectangles.map((rectangle, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded shadow-md relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor={`width-${index}`}>Width</label>
                                <input
                                    type="number"
                                    id={`width-${index}`}
                                    value={rectangle.width}
                                    onChange={(e) => handleRectangleChange(index, 'width', e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor={`height-${index}`}>Height</label>
                                <input
                                    type="number"
                                    id={`height-${index}`}
                                    value={rectangle.height}
                                    onChange={(e) => handleRectangleChange(index, 'height', e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveRectangle(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={handleAddRectangle} className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 mb-4 flex items-center justify-center">
                    <PlusIcon className="h-5 w-5" />
                </button>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {prices.length > 0 && prices.map((price, index) => (
                    <p key={index} className="text-green-500 mb-4">Price for rectangle {index + 1}: €{price}</p>
                ))}
                {totalPrice != null && <p className="text-blue-500 mb-4">Total price: €{totalPrice}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Calculate
                </button>
            </form>
        </div>
    );
};

export default PriceCalculator;