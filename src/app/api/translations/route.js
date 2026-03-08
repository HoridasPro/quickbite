// import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");

  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const translations = await db.dbConnect("translation").find({}).toArray();

    const result = {};

    translations.forEach((t) => {
      result[t.tid] = t[lang] || t.en;
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch translations" },
      { status: 500 },
    );
  }
}
