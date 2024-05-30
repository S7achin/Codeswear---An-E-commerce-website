import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDb();
  const { token, name, phone, address, pincode } = await req.json();
  // console.log(token);
  const data = jwt.verify(token, process.env.JWT_SECRET);
//   console.log(data);
  const userData = await User.findOneAndUpdate(
    { email: data.email },
    { name, address, phone, pincode }
  );
//   console.log(userData);
  return NextResponse.json(
    { message: "Details updated Successfully", success: true},
    { status: 200 }
  );
}
