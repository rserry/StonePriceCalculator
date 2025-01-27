import { Point } from "./Point";

/**
 * @swagger
 * components:
 *   schemas:
 *     Rectangle:
 *       type: object
 *       properties:
 *         width:
 *           type: number
 *         height:
 *           type: number
 *         bottomLeft:
 *           $ref: '#/components/schemas/Point'
 *           description: Optional bottom-left point of the rectangle
 *           nullable: true
 */
export class Rectangle {
    width: number;
    height: number;

    bottomLeft = new Point(0, 0);

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    setBottomLeft(point: Point) {
        this.bottomLeft = point;
    }

    rotate() {
        const temp = this.width;
        this.width = this.height;
        this.height = temp;
    }

    area(): number {
        return this.width * this.height;
    }

    intersects(rectangle: Rectangle): boolean {
        return this.bottomLeft.x < rectangle.bottomLeft.x + rectangle.width &&
            this.bottomLeft.x + this.width > rectangle.bottomLeft.x &&
            this.bottomLeft.y < rectangle.bottomLeft.y + rectangle.height &&
            this.bottomLeft.y + this.height > rectangle.bottomLeft.y;
    }
}