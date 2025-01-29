'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Rectangle } from '@/entities/Rectangle';

const SlabPlotter = dynamic(() => import('./SlabPlotter'), { ssr: false });

const PriceCalculator = () => {
    const [rectangles, setRectangles] = useState<{ rectangle: Rectangle, quantity: number }[]>([{ rectangle: new Rectangle(0, 0), quantity: 1 }]);
    const [placedRectangles, setPlacedRectangles] = useState<Rectangle[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>();
    const [prices, setPrices] = useState<number[]>([]);
    const [slabsNeeded, setSlabsNeeded] = useState<number>();
    const [leftoverArea, setLeftoverArea] = useState<number>();
    const [error, setError] = useState('');

    const handleRectangleChange = (index: number, field: 'width' | 'height', value: string) => {
        const newRectangles = [...rectangles];
        newRectangles[index].rectangle[field] = Number(value);
        setRectangles(newRectangles);
    };

    const handleQuantityChange = (index: number, value: string) => {
        const newRectangles = [...rectangles];
        newRectangles[index].quantity = Number(value);
        setRectangles(newRectangles);
    };

    const handleAddRectangle = () => {
        setRectangles([...rectangles, { rectangle: new Rectangle(0, 0), quantity: 1 }]);
    };

    const handleRemoveRectangle = (index: number) => {
        if (rectangles.length > 1) {
            const newRectangles = rectangles.filter((_, i) => i !== index);
            setRectangles(newRectangles);
        } else {
            setError('At least one rectangle must be present.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setPrices([]);
        setTotalPrice(undefined);
        setSlabsNeeded(undefined);
        setLeftoverArea(undefined);

        // Create duplicates of rectangles based on quantity
        const rectanglesToSend = rectangles.flatMap(item =>
            Array(item.quantity).fill(new Rectangle(item.rectangle.width, item.rectangle.height))
        );

        try {
            const response = await fetch('/api/calculate-price', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rectanglesToSend),
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
                {rectangles.map((item, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded shadow-md relative">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor={`width-${index}`}>Width (mm)</label>
                                <input
                                    type="number"
                                    id={`width-${index}`}
                                    value={item.rectangle.width}
                                    onChange={(e) => handleRectangleChange(index, 'width', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor={`height-${index}`}>Height (mm)</label>
                                <input
                                    type="number"
                                    id={`height-${index}`}
                                    value={item.rectangle.height}
                                    onChange={(e) => handleRectangleChange(index, 'height', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2" htmlFor={`quantity-${index}`}>Quantity</label>
                                <input
                                    type="number"
                                    id={`quantity-${index}`}
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    className="w-1/2 p-2 border border-gray-300 rounded"
                                    min="1"
                                />
                            </div>
                        </div>
                        {rectangles.length > 1 &&
                            <button
                                type="button"
                                onClick={() => handleRemoveRectangle(index)}
                                className="absolute top-2 right-2">
                                <TrashIcon className="w-6 h-6 text-red-500" />
                            </button>}
                    </div>
                ))}
                <button type="button" onClick={handleAddRectangle} className="flex items-center justify-center w-full p-2 mb-4 bg-blue-500 text-white rounded">
                    <PlusIcon className="w-6 h-6 mr-2" />
                </button>
                <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">Calculate Price</button>
                {error && <p className="text-red-500 mt-4 mb-4">{error}</p>}
                {prices.length > 0 && prices.map((price, index) => (
                    <p key={index} className="text-green-500 mt-4">Price for rectangle {index + 1}: €{price}</p>
                ))}
                {totalPrice && <p className="mt-4">Total Price: €{totalPrice}</p>}
                {slabsNeeded && <p className="mt-4">Slabs Needed: {slabsNeeded}</p>}
                {leftoverArea && <p className="mt-4">Leftover Area: {leftoverArea} mm²</p>}
            </form>
            <div>
                {slabsNeeded != null && placedRectangles.length > 0 && slabsNeeded > 0 && <SlabPlotter slabsNeeded={slabsNeeded} rectangles={placedRectangles} />}
            </div>
        </div>
    );
};

export default PriceCalculator;