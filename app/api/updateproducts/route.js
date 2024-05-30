import connectDb from "../../../middleware/mongoose";
import Product from "../../../models/Product";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDb();

  const productArray = await req.json();
  
  for (let i = 0; i < productArray.length; i++) {
    const p = await Product.findByIdAndUpdate(productArray[i]._id, productArray[i]);
    console.log(p);
  }
  return NextResponse.json({ message: "Products Updated !!" },{status: 201});
}
