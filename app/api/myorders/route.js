import connectDb from '../../../middleware/mongoose';
import Order from '../../../models/Order';
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export async function POST(req,res) {
    await connectDb()
    const {token } = await  req.json();
    // console.log(token);
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(data);
      const orders = await Order.find({email: data.email, status: 'Paid'});
      console.log(orders);
      return Response.json(orders)
    } catch (error) {
      console.log("JWT expired");
      return NextResponse.json(
        { error: "Session Expired!, Please Login again.." },
        { status: 401 }
      );
    }
  } 
