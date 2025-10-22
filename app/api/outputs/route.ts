import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const saved = await prisma.output.create({
      data: {
        htmlCode: body.htmlCode,
      },
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error saving output:', error);
    return NextResponse.json({ error: 'Failed to save output' }, { status: 500 });
  }
}
