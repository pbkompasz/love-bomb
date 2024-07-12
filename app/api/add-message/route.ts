import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log(searchParams)
  const loveBombRefId = searchParams.get("loveBombRefId");
  const messageText = searchParams.get("messageText");
  const imageUrl = searchParams.get("imageUrl");
  const senderFid = searchParams.get("senderFid");

  try {
    if (!loveBombRefId || !messageText || !senderFid) {
      throw new Error("All the values are required!");
    } else {
      const { rows } =
        await sql`INSERT INTO Messages (LoveBombRefId, MessageText, ImageUrl, SenderFid) VALUES (${loveBombRefId}, ${messageText}, ${imageUrl}, ${senderFid}) RETURNING id;`;
      if (rows && rows[0]) {
        return NextResponse.json({ id: rows[0].id }, { status: 200 });
      }
    }
  } catch (error: Error | any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
