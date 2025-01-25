/**
 * @swagger
 * components:
 *   schemas:
 *     Point:
 *       type: object
 *       properties:
 *         x:
 *           type: number
 *         y:
 *           type: number
 */
export type Point = {
    x: number;
    y: number;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Polygon:
 *       type: object
 *       properties:
 *         points:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Point'
 */
export type Polygon = {
    points: Point[];
};

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
 */
export type Rectangle = {
    width: number;
    height: number;
}