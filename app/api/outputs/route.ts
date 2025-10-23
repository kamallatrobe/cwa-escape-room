import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// POST /api/outputs
export async function POST(req: Request) {
  const t0 = Date.now();
  try {
    const { htmlCode } = await req.json();
    const row = await prisma.output.create({ data: { htmlCode } });
    const ms = Date.now() - t0;
    console.log(`[API] POST /api/outputs id=${row.id} in ${ms}ms`);
    return new Response(JSON.stringify(row), { status: 201 });
  } catch (err: any) {
    const ms = Date.now() - t0;
    console.error(`[API] POST /api/outputs ERROR in ${ms}ms`, err);
    return new Response('Error', { status: 500 });
  }
}

// GET /api/outputs
export async function GET() {
  const t0 = Date.now();
  const rows = await prisma.output.findMany({ orderBy: { id: 'desc' } });
  const ms = Date.now() - t0;
  console.log(`[API] GET /api/outputs count=${rows.length} in ${ms}ms`);
  return new Response(JSON.stringify(rows), { status: 200 });
}
