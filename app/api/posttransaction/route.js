import connectDb from "../../../middleware/mongoose";
import Order from "../../../models/Order";
import PaytmChecksum from "paytmchecksum";
import Product from "../../../models/Product";

export async function POST(req, res) {
  await connectDb();
  
  // Validate paytm checksum
  var paytmChecksum = "";
  var paytmParams = {};

  const body = req.body;
  for (var key in body) {
    if (key == "CHECKSUMHASH") {
      paytmChecksum = body[key];
    } else {
      paytmParams[key] = body[key];
    }
  }

  var isVerifySignature = PaytmChecksum.verifySignature(
    body,
    config.process.env.PAYTM_MKEY,
    paytmChecksum
  );
  if (isVerifySignature) {
    console.log("Checksum Matched");
  } else {
    console.log("Checksum Mismatched");
    return res.status(500).send("Some Error Occured");

  }

  // Update status into Orders table after checking the transaction status
  let order;
  if (req.body.STATUS === "TXN_SUCCESS") {
    order = await Order.findOne(
      { orderId: req.body.ORDERID },
      { status: "Paid", paymentInfo: JSON.stringify(req.body), transactionId: req.body.TXNID  }
    );
    let products = order.products;
    for (let slug in products) {
      await Product.findOneAndUpdate(
        { slug: slug },
        { $inc: { availableQty: -products[slug].qty } }
      );
    }
    // await Order.findByIdAndUpdate(order._id, {status: 'Paid'})
  } else if (req.body.STATUS == "PENDING") {
    order = await Order.findOne(
      { orderId: req.body.ORDERID },
      { status: "Pending", paymentInfo: JSON.stringify(req.body), transactionId: req.body.TXNID }
    );
  }

  return Response.redirect("/order?clearCart=1&id=" + order._id, 200);

  // return Response.json({body: req.body})
}
