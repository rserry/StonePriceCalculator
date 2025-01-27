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
}

export function getArea(rectangle: Rectangle): number {
    return rectangle.width * rectangle.height;
}