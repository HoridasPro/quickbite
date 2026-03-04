import { dbConnect } from "@/app/lib/dbConnect";

export async function GET() {
  try {
    const usersCollection = await dbConnect("allFoods");
    const allUsers = await usersCollection.find({}).toArray();

    return Response.json(allUsers);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const usersCollection = await dbConnect("allFoods");
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return Response.json(
        { success: false, message: "Please sent a message" },
        { status: 400 },
      );
    }

    const newFeedback = { message, date: new Date().toISOString() };
    const result = await usersCollection.insertOne(newFeedback);
    return Response.json(result);
  } catch (err) {
    console.error("POST USER ERROR:", err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
