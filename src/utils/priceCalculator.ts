import { Rectangle } from "@/entities/Rectangle";
import solve from "./2d-bin-packing-solver/solver";

export function calculatePrice(rects: Rectangle[]): { totalPrice: number, prices: number[], slabsNeeded: number, rectangles: Rectangle[], leftoverArea: number } {
    const costPerSquareMeter = 1;
    const costPerSlab = 100;
    const slabSize: Rectangle = new Rectangle(100, 200);

    const { slabsNeeded, rectangles, leftoverArea } = solve(rects, slabSize.width, slabSize.height);
    const prices = rectangles.map(rectangle => rectangle.area() * costPerSquareMeter);
    const totalPrice = prices.reduce((acc, price) => acc + price, 0) + (slabsNeeded * costPerSlab);
    return { totalPrice, prices, slabsNeeded, rectangles, leftoverArea };
}