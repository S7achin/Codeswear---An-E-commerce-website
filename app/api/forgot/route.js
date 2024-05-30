import { NextResponse } from "next/server";
import Forgot from "../../../models/Forgot";
import User from "../../../models/User";
import nodemailer from "nodemailer";
import connectDb from "../../../middleware/mongoose";
const CryptoJS = require("crypto-js");

export async function POST(req, res) {
  await connectDb();
  const { email, password, cpassword, sendMail, token } = await req.json();
  const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;
  console.log({
    email,
    password,
    cpassword,
    sendMail,
    token,
    SMTP_EMAIL,
    SMTP_PASSWORD,
  });

  // Send an email to the user
  if (sendMail) {
    // Check if the user is exists in the Database
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user exists with this email" },
        { status: 400 }
      );
    }
    // Send reset password email
    const token = Math.floor(Math.random() * Date.now());
    const emailSend = `We have sent you this email in response to your request to reset your password on Codeswear.com 

    To reset your password for, please follow the link below:

    <a href="http://localhost:3000/forgot?token=${token}">Click here to reset your password</a>

    <br/><br/>

    We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to your  My Account Page and change your password.

    <br/><br/>`;

    let forgot = new Forgot({
      email: email,
      token: token,
    });

    await forgot.save();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    try {
      const testResult = await transport.verify();
      console.log(testResult);
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      const sendResult = await transport.sendMail({
        from: SMTP_EMAIL,
        to: email,
        subject: "Password reset instructions - Codeswear.com",
        html: emailSend,
      });
      console.log(sendResult);
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password reset instructions have been sent to your email",
      },
      { status: 200 }
    );
  } else {
    // Reset User Password
    // Check if token exists and password matched
    if (password == cpassword) {
      const forgotUser = await Forgot.findOne({ token });
      if (!forgotUser) {
        return NextResponse.json(
          {
            success: false,
            message: "Some Error Occured! Token not found or expired",
          },
          { status: 400 }
        );
      }

      await User.findOneAndUpdate(
        { email: forgotUser.email },
        {
          password: CryptoJS.AES.encrypt(
            password,
            process.env.AES_SECRET
          ).toString(),
        }
      );
      return NextResponse.json(
        { success: true, message: "Password reset successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Confirm Password not matched!",
        },
        { status: 400 }
      );
    }
  }
}
