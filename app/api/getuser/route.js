import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDb();
  const { token } = await req.json();
  // console.log(token);
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(data);
    const userData = await User.findOne({ email: data.email });
    const { name, email, phone, address, pincode, isAdmin } = userData;
    return NextResponse.json(
      { name, email, phone, address, pincode, isAdmin },
      { status: 200 }
    );
  } catch (error) {
    console.log("JWT expired");
      return NextResponse.json(
        { error: "Session Expired!, Please Login again.." },
        { status: 401 }
      );
  }
}
