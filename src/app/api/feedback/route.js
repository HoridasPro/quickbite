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

// app/api/feedback/route.js
// app/api/feedback/route.js
// import { connect } from "@/app/lib/dbConnect";

// export async function GET(request) {
//   try {
//     // ✅ Optional Authorization check (startsWith safe)
//     const authHeader = request.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer")) {
//       return new Response(JSON.stringify({ message: "Unauthorized" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const feedbackCollection = await connect("allFoods"); // async connect
//     const result = await feedbackCollection.find().toArray();

//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("GET /api/feedback error:", err);
//     return new Response(
//       JSON.stringify({ message: "Failed to fetch feedback" }),
//       { status: 500, headers: { "Content-Type": "application/json" } },
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     // ✅ Optional Authorization check (startsWith safe)
//     const authHeader = request.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer")) {
//       return new Response(JSON.stringify({ message: "Unauthorized" }), {
//         status: 401,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const feedbackCollection = await connect("allFoods"); // async connect
//     const body = await request.json();
//     const message = body?.message; // ✅ optional chaining

//     if (!message || typeof message !== "string") {
//       return new Response(
//         JSON.stringify({ message: "Please send a valid message" }),
//         { status: 400, headers: { "Content-Type": "application/json" } },
//       );
//     }

//     const newFeedback = { message, date: new Date().toISOString() };
//     const result = await feedbackCollection.insertOne(newFeedback);

//     return new Response(JSON.stringify(result), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     console.error("POST /api/feedback error:", err);
//     return new Response(
//       JSON.stringify({ message: "Failed to save feedback" }),
//       { status: 500, headers: { "Content-Type": "application/json" } },
//     );
//   }
// }
