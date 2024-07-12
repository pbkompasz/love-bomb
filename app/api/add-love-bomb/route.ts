import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipient = searchParams.get("recipient");
  const deploymentDate = searchParams.get("deploymentDate");
  const numberOfContributors = searchParams.get("numberOfContributors");
  const creator = searchParams.get("creator");

  try {
    if (
      !recipient &&
      !deploymentDate &&
      !numberOfContributors
    ) {
      const { rows } =
        await sql`INSERT INTO LoveBombs DEFAULT VALUES RETURNING id;`;
      if (rows && rows[0])
        return NextResponse.json({ id: rows[0]?.id }, { status: 200 });
    } else if (
      !recipient ||
      !deploymentDate ||
      !numberOfContributors ||
      !creator
    ) {
      console.log("here");
      throw new Error("All the values are required!");
    } else {
      const { rows } =
        await sql`INSERT INTO LoveBombs (Recipient, Creator, DeploymentDate, NumberOfContributors, Status) VALUES (${recipient}, ${creator}, ${deploymentDate}, ${numberOfContributors}, false) RETURNING id;`;
      if (rows && rows[0]) {
        const loveBomb = await sql`SELECT * FROM LoveBombs WHERE id = ${rows[0]?.id};`;
        return NextResponse.json({ loveBomb }, { status: 200 });
      }
    }
  } catch (error: Error | any) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
