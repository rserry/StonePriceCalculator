import { Rectangle } from "@/entities/Rectangle";

// Helper function to check placement
function canPlaceRectangle(rectangle: Rectangle, placedRectangles: Rectangle[], x: number, y: number): boolean {
    rectangle.bottomLeft = { x, y };
    return !placedRectangles.some(placedRectangle => rectangle.intersects(placedRectangle));
}

export default function solve(rectangles: Rectangle[], slabWidth: number, slabHeight: number): { slabsNeeded: number, rectangles: Rectangle[], leftoverArea: number } {
    const slabArea = slabWidth * slabHeight;

    let slabsNeeded = 1;
    const placedRectangles: Rectangle[] = [];
    const slabPositions = [{ x: 0, y: 0 }]; // Track the positions of all slabs

    rectangles.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    rectangles.forEach(rectangle => {
        if (!(rectangle instanceof Rectangle)) {
            throw new Error('Invalid rectangle');
        }

        // Check if the rectangle fits in the slab in either orientation
        const fitsOriginal = rectangle.width <= slabWidth && rectangle.height <= slabHeight;
        const fitsRotated = rectangle.height <= slabWidth && rectangle.width <= slabHeight;

        if (!fitsOriginal && !fitsRotated) {
            throw new Error(`Rectangle ${rectangle.width}x${rectangle.height} does not fit in the slab`);
        }

        let placed = false;

        for (const slab of slabPositions) {
            // Check original orientation
            for (let y = slab.y; y <= slab.y + slabHeight - rectangle.height && !placed; y++) {
                for (let x = slab.x; x <= slab.x + slabWidth - rectangle.width && !placed; x++) {
                    if (fitsOriginal && canPlaceRectangle(rectangle, placedRectangles, x, y)) {
                        placedRectangles.push(new Rectangle(rectangle.width, rectangle.height));
                        placedRectangles[placedRectangles.length - 1].bottomLeft = { x, y };
                        placed = true;
                        break;
                    }
                }
            }

            // Check rotated orientation
            for (let y = slab.y; y <= slab.y + slabHeight - rectangle.width && !placed; y++) {
                for (let x = slab.x; x <= slab.x + slabWidth - rectangle.height && !placed; x++) {
                    if (fitsRotated && canPlaceRectangle(new Rectangle(rectangle.height, rectangle.width), placedRectangles, x, y)) {
                        placedRectangles.push(new Rectangle(rectangle.height, rectangle.width));
                        placedRectangles[placedRectangles.length - 1].bottomLeft = { x, y };
                        placed = true;
                        break;
                    }
                }
            }
        }

        if (!placed) {
            // Move to the next slab
            slabsNeeded++;
            const newSlabX = slabPositions[slabPositions.length - 1].x + slabWidth;
            slabPositions.push({ x: newSlabX, y: 0 });

            // Check the best orientation for the new slab
            if (fitsOriginal) {
                rectangle.bottomLeft = { x: newSlabX, y: 0 };
                placedRectangles.push(rectangle);
            } else if (fitsRotated) {
                rectangle.bottomLeft = { x: newSlabX, y: 0 };
                rectangle.rotate();
                placedRectangles.push(rectangle);
            }
        }
    });

    if (placedRectangles.length !== rectangles.length) {
        throw new Error('Not all rectangles could be placed');
    }

    if (placedRectangles.some(rectangle => placedRectangles.some(otherRectangle => rectangle !== otherRectangle && rectangle.intersects(otherRectangle)))) {
        throw new Error('Rectangles intersect');
    }

    const rectanglesArea = rectangles.reduce((acc, rectangle) => acc + rectangle.area(), 0);
    const leftoverArea = slabsNeeded * slabArea - rectanglesArea;
    return { slabsNeeded, rectangles: placedRectangles, leftoverArea };
}