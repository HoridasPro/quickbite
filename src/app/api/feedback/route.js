import { dbConnect } from "@/app/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const users = await dbConnect("allFoods");
    const allUsers = await users.find({}).toArray(); // MongoDB থেকে সব user

    return new Response(JSON.stringify(allUsers), {
      status: 200,
    });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, image } = body;

    if (!name || !email || !password)
      return new Response(
        JSON.stringify({ success: false, message: "All fields required" }),
        { status: 400 },
      );

    const users = await dbConnect("allFoods");

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return new Response(
        JSON.stringify({ success: false, message: "User already exists" }),
        { status: 400 },
      );

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      image: image || null,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({ success: true, message: "User created successfully" }),
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 },
    );
  }
}
