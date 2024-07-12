import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const recipient = searchParams.get("recipient");
  const deploymentDate = searchParams.get("deploymentDate");
  const numberOfContributors = searchParams.get("numberOfContributors");
  const creator = searchParams.get("creator");

  console.log(searchParams);

  try {
    if (
      !id ||
      !recipient ||
      !deploymentDate ||
      !numberOfContributors ||
      !creator
    ) {
      console.log("here");
      throw new Error("All the values are required!");
    } else {
      await sql`UPDATE LoveBombs SET Recipient=${recipient}, DeploymentDate=${deploymentDate}, NumberOfContributors=${numberOfContributors}, Creator=${creator} WHERE id=${id};`;
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error: Error | any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
