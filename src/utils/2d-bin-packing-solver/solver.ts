import { getArea, Rectangle } from "@/entities/Rectangle";

export default function solve(rectangles: Rectangle[], slabWidth: number, slabHeight: number): { slabsNeeded: number, rectangles: Rectangle[], leftoverArea: number } {
    // TODO Implementation of the 2D bin packing algorithm

    const slabArea = slabWidth * slabHeight;
    const rectanglesArea = rectangles.reduce((acc, rectangle) => acc + getArea(rectangle), 0);
    const slabsNeeded = Math.ceil(rectanglesArea / slabArea);
    const leftoverArea = slabsNeeded * slabArea - rectanglesArea;
    return { slabsNeeded, rectangles, leftoverArea };
}