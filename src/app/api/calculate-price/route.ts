import { calculatePrice } from '@/utils/priceCalculator';
import { NextRequest, NextResponse } from 'next/server';


/**
 * @swagger
 * /api/calculate-price:
 *  post:
 *     summary: Calculate the price of a stone piece
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               width:
 *                  type: float
 *                  description: The width of the piece.
 *                  example: 5.59
 *               height:
 *                  type: float
 *                  description: The height of the piece.
 *                  example: 10.5
 *     responses:
 *       200:
 *         description: The price of the stone piece
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 price:
 *                   type: integer
 *                   description: The price of the stone piece    
 *                   example: 135.16
 */
export async function POST(request: NextRequest) {
    const { width, height } = await request.json();
    const price = calculatePrice(width, height);
    return NextResponse.json({ price });
}