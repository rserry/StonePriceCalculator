import { Rectangle } from "@/entities/Rectangle";
import solve from "./2d-bin-packing-solver/solver";

export function calculatePrice(rects: Rectangle[]): { totalPrice: number, prices: number[], slabsNeeded: number, rectangles: Rectangle[], leftoverArea: number } {
    const costPerSquareMeter = 100;
    const squareMMPerSquareMeter = 1000000;
    const costPerSlab = 200;
    const slabSize: Rectangle = new Rectangle(1000, 2000);

    const { slabsNeeded, rectangles, leftoverArea } = solve(rects, slabSize.width, slabSize.height);
    const prices = rectangles.map(rectangle => rectangle.area() / squareMMPerSquareMeter * costPerSquareMeter);
    const totalPrice = prices.reduce((acc, price) => acc + price, 0) + (slabsNeeded * costPerSlab);
    return { totalPrice, prices, slabsNeeded, rectangles, leftoverArea };
}