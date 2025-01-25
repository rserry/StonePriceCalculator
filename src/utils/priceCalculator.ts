import type { Rectangle } from "@/types";

export function calculatePrice(rectangles: Rectangle[]): { totalPrice: number, prices: number[] } {
    const costPerSquareMeter = 1;
    const prices: number[] = [];
    rectangles.forEach((rectangle) => {
        const { width, height } = rectangle;
        const pieceArea = width * height;
        prices.push(parseFloat((pieceArea * costPerSquareMeter).toFixed(2)));
    });
    return { totalPrice: prices.reduce((acc, price) => acc + price, 0), prices };
}