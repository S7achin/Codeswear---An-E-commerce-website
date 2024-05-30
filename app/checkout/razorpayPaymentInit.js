"use client";

// import { NextResponse } from "next/server";
// import { redirect} from "next/navigation"
import { toast } from "react-toastify";

const makePayment = async (data, clearCart) => {

  const key = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;
  // console.log(key);
  // Make API call to the serverless API
  const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/razorpay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const txnRes = await a.json();
  // console.log(txnRes);

  const order = txnRes.order;

  if (!txnRes.error || txnRes.success) {
    const options = {
      key: key,
      name: "Sachin",
      currency: order.currency,
      amount: order.amount,
      order_id: order.id,
      description: "Understanding RazorPay Integration",
      // image: logoBase64,
      handler: async function (response) {
        // if (response.length==0) return <Loading/>;
        // console.log(response);

        const info = {
          websiteName: "Sachin Developing LTD",
          orderId: data.oid,
          paymentId: response.razorpay_payment_id,
          paymentOrderId: response.razorpay_order_id,
          txnAmount: {
            value: data.subTotal,
            currency: "INR",
          },
          userInfo: {
            custId: data.email,
          },
        };

        const DATA = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/paymentverify`,
          {
            method: "POST",
            // headers: {
            //   // Authorization: 'YOUR_AUTH_HERE'
            // },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              oid: data.oid,
              paymentInfo: JSON.stringify(info),
            }),
          }
        );

        const res = await DATA.json();

        console.log("response verify==", res);

        if (res?.message == "success") {
          console.log("redirected.......to ",data.oid);
          // let URL = "/order?clearCart=1&orderId=" + data.oid;
          let URL = "/order?clearCart=1&id=" + res.oid;
          window.location.href = URL;

          // return {
          //   redirect: {
          //     destination: URL,
          //     permanent: false, // Set to true for permanent redirects
          //   },
          // };
          // Response.redirect("/order?clearCart=1&orderId=" + data.oid);
          // redirect(`/order?clearCart=1&orderId=${data.oid}`);
          // NextResponse.rewrite("/order?clearCart=1&orderId=" + data.oid);
          // router.push(
          //   "/paymentsuccess?paymentid=" + response.razorpay_payment_id
          // );
        }

        // Validate payment at server - using webhooks is a better idea.
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.phone,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again. Contact support for help");
      // alert("Payment failed. Please try again. Contact support for help");
    });
  } else {
    // console.log(txnRes.message);
    // console.log(txnRes.clearcart);
    if (txnRes.clearcart) {
      clearCart();
    }
    toast.error(txnRes.message);
  }
};

export default makePayment;
