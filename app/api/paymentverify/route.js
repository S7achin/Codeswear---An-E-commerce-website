import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDb from "../../../middleware/mongoose";
import Order from "../../../models/Order";
import Product from "../../../models/Product";


export async function POST(req, res) {
  await connectDb();
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    oid,
    paymentInfo,
  } = await req.json();

  const info = JSON.parse(paymentInfo);

//   console.log(oid, info);

  const body = razorpay_order_id + "|" + razorpay_payment_id;
//   console.log("id==", body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.NEXT_PUBLIC_RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  let order;
  if (isAuthentic) {
    console.log("Payment Successfull");
     order = await Order.findOneAndUpdate(
      { orderId: oid },
      { status: "Paid", paymentInfo: info, transactionId : razorpay_payment_id }
    );
    // console.log("logging order", order);
    let products = order.products;
    for (let slug in products) {
      await Product.findOneAndUpdate(
        { slug: slug },
        { $inc: { availableQty: -products[slug].qty } }
      );
    }
    // res.redirect("/order?clearCart=1&id=" + oid)

  } else {
    return NextResponse.json(
      {
        message: "fail",
      },
      {
        status: 400,
      }
    );
  }
  return NextResponse.json(
    {
      message: "success",oid: order._id
    },
    {
      status: 200,
    }
  );
}
