import connectDb from "../../../middleware/mongoose";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
const CryptoJS = require("crypto-js");
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDb();
  const { token, oldpassword, password, cpassword } = await req.json();
  if (password == cpassword) {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const userExist = await User.findOne({ email: data.email });

    const decryptedPassword = CryptoJS.AES.decrypt(
      userExist.password,
      process.env.AES_SECRET
    ).toString(CryptoJS.enc.Utf8);

    // console.log(decryptedPassword);

    if (decryptedPassword == oldpassword) {
      const userData = await User.findOneAndUpdate(
        { email: data.email },
        {
          password: CryptoJS.AES.encrypt(
            password,
            process.env.AES_SECRET
          ).toString(),
        }
      );
      return NextResponse.json(
        { message: "Password updated Successfully", success: true },
        { status: 200 }
      );
    }
    else{
        return NextResponse.json(
            { message: "Invalid Password", success: false },
            { status: 400 }
          );
    }
  } else {
    return NextResponse.json(
      { message: "Confirm Password not matched", success: false },
      { status: 400 }
    );
  }
}
