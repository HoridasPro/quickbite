import { connect } from "@/app/lib/dbConnect";
const feedbackCollection1 = connect("allFoods");

// For the GET
export async function GET(request) {
  const result = await feedbackCollection1.find().toArray();
  return Response.json(result);
}

//For the POST
export async function POST(request) {
  const { message } = await request.json();
  if (!message || typeof message !== "string") {
    return Response.json({
      status: 400,
      message: "plese sent a message",
    });
  }
  const newFeedback = { message, date: new Date().toISOString() };
  const result = await feedbackCollection1.insertOne(newFeedback);

  return Response.json(result);
}
