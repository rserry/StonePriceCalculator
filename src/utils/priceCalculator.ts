export function calculatePrice(width: number, height: number): number {
    const pieceArea = width * height;
    const costPerSquareMeter = 1;

    return parseFloat((pieceArea * costPerSquareMeter).toFixed(2));
}