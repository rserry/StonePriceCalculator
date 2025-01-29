import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { calculatePrice } from '@/utils/priceCalculator';
import { Rectangle } from '@/entities/Rectangle';

/**
 * @swagger
 * /api/calculate-price:
 *   post:
 *     summary: Calculate the price of stone pieces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 width:
 *                   type: number
 *                   description: The width of the piece in mm
 *                   example: 559
 *                 height:
 *                   type: number
 *                   description: The height of the piece in mm
 *                   example: 105
 *     responses:
 *       200:
 *         description: The price of the stone pieces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPrice:
 *                   type: number
 *                   description: The total price of all the stone pieces
 *                   example: 335.61
 *                 prices:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: The prices of the stone pieces    
 *                   example: [135.16, 200.45]
 *                 slabsNeeded:
 *                   type: number
 *                   description: The number of slabs needed
 *                   example: 3
 *                 rectangles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rectangle'
 *                 leftoverArea:
 *                   type: number
 *                   description: The leftover area of the slabs
 *                   example: 100.60     
 */
export async function POST(request: NextRequest) {
    const rects: Rectangle[] = (await request.json()).map((rect: { width: number, height: number }) => new Rectangle(rect.width, rect.height));
    const { totalPrice, prices, slabsNeeded, rectangles, leftoverArea } = calculatePrice(rects);
    return NextResponse.json({ totalPrice, prices, slabsNeeded, rectangles, leftoverArea });
}