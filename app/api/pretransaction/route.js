const https = require("https");
const PaytmChecksum = require("paytmchecksum");
import connectDb from "../../../middleware/mongoose";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import { NextResponse } from "next/server";
import pincodes from "../../../pincodes.json";

export async function POST(req, res) {
  await connectDb();
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

  // console.log(cart, subTotal, oid, email, name, address, phone, pincode);

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
    name:name,
    email: email,
    phone: phone,
    orderId: oid,
    address: address + ", " + city + ", " + state + ", " + pincode,
    amount: subTotal,
    products: cart,
  });
  await order.save();

  // Initiating payment
  var paytmParams = {};

  paytmParams.body = {
    requestType: "Payment",
    mid: process.env.PAYTM_MID,
    websiteName: "YOUR_WEBSITE_NAME",
    orderId: oid,
    callbackUrl: `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
    txnAmount: {
      value: subTotal,
      currency: "INR",
    },
    userInfo: {
      custId: email,
    },
  };

  /*
   * Generate checksum by parameters we have in body
   * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
   */
  const checksum = PaytmChecksum.generateSignature(
    JSON.stringify(paytmParams.body),
    process.env.PAYTM_MKEY
  );

  var post_data = JSON.stringify(paytmParams);

  const requestAsync = async () => {
    return new Promise((resolve, reject) => {
      var options = {
        /* for Staging */
        hostname: "securegw-stage.paytm.in",
        /* for Production */
        // hostname: "securegw.paytm.in",

        port: 443,
        path: `/theia/api/v1/initiateTransaction?mid=${process.env.PAYTM_MID}&orderId=${oid}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": post_data.length,
        },
      };

      var response = "";
      var post_req = https.request(options, function (post_res) {
        post_res.on("data", function (chunk) {
          response += chunk;
        });

        post_res.on("end", function () {
          console.log("Response: ", response);
          let ress = JSON.parse(response).body;
          ress.success = true;
          resolve(ress);
        });
      });

      post_req.write(post_data);
      post_req.end();
    });
  };

  let myr = await requestAsync();

  return Response.json(myr);
}
