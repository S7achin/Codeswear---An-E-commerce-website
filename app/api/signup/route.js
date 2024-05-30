import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
const CryptoJS = require("crypto-js");
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDb();
  const user = await req.json();
  const { name, email, password } = user;
  // console.log(user);
  let u = new User({
    name,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.AES_SECRET).toString(),
  });
  await u.save();

  return NextResponse.json(
    { message: "Registration Successfull" },
    { status: 201 }
  );
}
