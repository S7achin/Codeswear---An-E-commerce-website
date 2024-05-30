import connectDb from "../../../middleware/mongoose";
import Product from "../../../models/Product";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  await connectDb();

  let productArray = await req.json();
  console.log(productArray);

  for (let i = 0; i < productArray.length; i++) {
    const p = new Product({
      title: productArray[i].title,
      slug: productArray[i].slug,
      desc: productArray[i].desc,
      img: productArray[i].img,
      category: productArray[i].category,
      size: productArray[i].size,
      color: productArray[i].color,
      price: productArray[i].price,
      availableQty: productArray[i].availableQty,
    });
    console.log(p);

    await p.save();
  }
  return NextResponse.json({ message: "Products added to DB" },{status: 201});
}
