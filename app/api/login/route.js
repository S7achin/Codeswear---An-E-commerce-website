import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import { NextResponse } from "next/server";
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

export async function POST(req, res) {
  await connectDb();
  // const user = await req.json();
  const { email, password } = await req.json();
  const userExist = await User.findOne({ email });

  // console.log(userExist);
  const decryptedPassword = CryptoJS.AES.decrypt(
    userExist.password,
    process.env.AES_SECRET
  ).toString(CryptoJS.enc.Utf8);

  if (!userExist) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  } else {
    if (decryptedPassword === password) {
      var token = jwt.sign(
        { email: email, name: userExist.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );
      // console.log(userExist.isAdmin );
      return NextResponse.json(
        { message: "Login Successfull", token, email, isAdmin: userExist.isAdmin },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid Login Credentials" },
        { status: 401 }
      );
    }
  }
}
