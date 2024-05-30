import connectDb from "../../../middleware/mongoose";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";
import pincodes from "../../../pincodes.json";

const instance = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
  key_secret: process.env.NEXT_PUBLIC_RAZORPAY_API_SECRET,
});

export async function POST(req, res) {
  await connectDb();
  // const body = await req.json();
  const {
    cart,
    subTotal,
    oid,
    email,
    name,
    address,
    phone,
    pincode,
    city,
    state,
  } = await req.json();

  // Check if the pincode is serviceable
  if (!Object.keys(pincodes).includes(pincode)) {
    return NextResponse.json(
      {
        error: true,
        clearcart: false,
        message: "Sorry! The pincode you have entered is not serviceable!",
      },
      { status: 400 }
    );
  }

  if (subTotal <= 0) {
    return NextResponse.json(
      {
        error: true,
        message: "Cart Empty! Please build your cart and try again!",
      },
      { status: 400 }
    );
  }

  // Check if the details are valid
  if (phone.length !== 10 || isNaN(phone)) {
    return NextResponse.json(
      {
        error: true,
        clearcart: false,
        message: "Please enter your 10 digit phone number!",
      },
      { status: 400 }
    );
  }
  if (pincode.length !== 6 || isNaN(pincode)) {
    return NextResponse.json(
      {
        error: true,
        clearcart: false,
        message: "Please enter your valid 6 digit pincode!",
      },
      { status: 400 }
    );
  }

  // Check if the cart is tempered with
  let product,
    sumTotal = 0;
  for (let item in cart) {
    sumTotal += cart[item].price * cart[item].qty;
    product = await Product.findOne({ slug: item });
    // Check if the cart items are out of stock
    if (product.availableQty < cart[item].qty) {
      return NextResponse.json(
        {
          error: true,
          clearcart: true,
          message:
            "Some items in your cart went out of stock. Please try again!",
        },
        { status: 400 }
      );
    }

    if (product.price != cart[item].price) {
      return NextResponse.json(
        {
          error: true,
          clearcart: true,
          message: "The price of some items in your cart have changed",
        },
        { status: 400 }
      );
    }
  }
  if (sumTotal != subTotal) {
    return NextResponse.json(
      {
        error: true,
        clearcart: true,
        message: "The price of some items in your cart have changed",
      },
      { status: 400 }
    );
  }

  // Initiate an order corressponding to this orderId
  const order = new Order({
    name: name,
    email: email,
    phone: phone,
    orderId: oid,
    address: address + ", " + city + ", " + state + ", PinCode: " + pincode,
    amount: subTotal,
    products: cart,
  });
  await order.save();

  //   Initiating the payment
  const payment_capture = 1;
  const amount = subTotal * 100; // amount in paisa. In our case it's INR 1
  const currency = "INR";
  const options = {
    amount: amount.toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
    notes: {
      // These notes will be added to your transaction. So you can search it within their dashboard.
      // Also, it's included in webhooks as well. So you can automate it.
      paymentFor: "testingDemo",
      userId: "100",
      productId: "P100",
    },
  };

  const orders = await instance.orders.create(options);
  // console.log(orders);
  return NextResponse.json(
    {
      error: false,
      clearcart: false,
      message: "Success",
      order: orders,
    },
    { status: 200 }
  );

  //   return NextResponse.json({ msg: body });
}
