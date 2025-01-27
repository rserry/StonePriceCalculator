'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Rectangle } from '@/entities/Rectangle';

const SlabPlotter = dynamic(() => import('./SlabPlotter'), { ssr: false });

const PriceCalculator = () => {
    const [rectangles, setRectangles] = useState<Rectangle[]>([new Rectangle(0, 0)]);
    const [placedRectangles, setPlacedRectangles] = useState<Rectangle[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>();
    const [prices, setPrices] = useState<number[]>([]);
    const [slabsNeeded, setSlabsNeeded] = useState<number>();
    const [leftoverArea, setLeftoverArea] = useState<number>();
    const [error, setError] = useState('');

    const handleRectangleChange = (index: number, field: 'width' | 'height', value: string) => {
        const newRectangles = [...rectangles];
        newRectangles[index][field] = Number(value);
        setRectangles(newRectangles);
    };

    const handleAddRectangle = () => {
        setRectangles([...rectangles, new Rectangle(0, 0)]);
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
            const response = await fetch('/api/calculate-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rectangles),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate price');
            }

            const { totalPrice, prices, slabsNeeded, rectangles: placedRectangles, leftoverArea } = await response.json();
            setTotalPrice(totalPrice);
            setPrices(prices);
            setSlabsNeeded(slabsNeeded);
            setPlacedRectangles(placedRectangles);
            setLeftoverArea(leftoverArea);
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
                                <label className="block text-gray-700 mb-2" htmlFor={`width-${index}`}>Width (cm)</label>
                                <input
                                    type="number"
                                    id={`width-${index}`}
                                    value={rectangle.width}
                                    onChange={(e) => handleRectangleChange(index, 'width', e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    step="0.1"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor={`height-${index}`}>Height (cm)</label>
                                <input
                                    type="number"
                                    id={`height-${index}`}
                                    value={rectangle.height}
                                    onChange={(e) => handleRectangleChange(index, 'height', e.target.value)}
                                    className="w-full px-3 py-2 border rounded"
                                    step="0.1"
                                    min="0"
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
                {slabsNeeded != null && <p className="text-blue-500 mb-4">Slabs needed: {slabsNeeded}</p>}
                {leftoverArea != null && <p className="text-blue-500 mb-4">Leftover area: {leftoverArea}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    Calculate
                </button>
            </form>
            <div>
                {slabsNeeded != null && placedRectangles.length > 0 && slabsNeeded > 0 && <SlabPlotter slabsNeeded={slabsNeeded} rectangles={placedRectangles} />}
            </div>
        </div>
    );
};

export default PriceCalculator;