// import clientPromise from "@/app/lib/dbConnect";

import clientPromise from "@/lib/dbConnect";

// GET
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("allFoods").find().toArray();
    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { message: "Please send a valid message" },
        { status: 400 }
      );
    }

    const newFeedback = {
      message,
      date: new Date().toISOString(),
    };

    const result = await db
      .collection("allFoods")
      .insertOne(newFeedback);

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
