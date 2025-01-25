import type { Rectangle } from '@/types';
import { calculatePrice } from '@/utils/priceCalculator';
import { NextRequest, NextResponse } from 'next/server';


/**
 * @swagger
 * /api/calculate-price:
 *  post:
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
 *                   type: float
 *                   description: The width of the piece.
 *                   example: 5.59
 *                 height:
 *                   type: float
 *                   description: The height of the piece.
 *                   example: 10.5
 *     responses:
 *       200:
 *         description: The price of the stone pieces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPrice:
 *                  type: number
 *                  description: The total price of all the stone pieces
 *                  example: 335.61
 *                 prices:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: The prices of the stone pieces    
 *                   example: [135.16, 200.45]
 */
export async function POST(request: NextRequest) {
    const rectangles: Rectangle[] = await request.json();
    const { totalPrice, prices } = calculatePrice(rectangles);
    return NextResponse.json({ totalPrice, prices });
}