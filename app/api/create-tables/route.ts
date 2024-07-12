import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const results = await Promise.all([
      await sql`CREATE TABLE LoveBombs (id SERIAL, OrganizerFid int, Recipient int, DeploymentDate bigint, NumberOfContributors int, Invitee int, active boolean, Creator int);`,
      await sql`CREATE TABLE Messages (id SERIAL, SenderFid int NOT NULL, ImageUrl varchar(100), MessageText varchar(320) NOT NULL, LoveBombRefId int NOT NULL);`,
    ]);
    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
