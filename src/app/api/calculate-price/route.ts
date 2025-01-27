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
 *               $ref: '#/components/schemas/Rectangle'
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
 *                 leftoverArea:
 *                   type: number
 *                   description: The leftover area of the slabs
 *                   example: 100.60     
 */
export async function POST(request: NextRequest) {
    const rectangles: Rectangle[] = await request.json();
    const { totalPrice, prices, slabsNeeded, leftoverArea } = calculatePrice(rectangles);
    return NextResponse.json({ totalPrice, prices, slabsNeeded, leftoverArea });
}