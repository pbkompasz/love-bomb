import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    const { rows } = await sql`SELECT * FROM LoveBombs WHERE id=${id}`;
    if (rows && rows[0]) {
      return NextResponse.json({ loveBomb: rows[0] }, { status: 200 });
    }
  } catch (error: Error | any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
