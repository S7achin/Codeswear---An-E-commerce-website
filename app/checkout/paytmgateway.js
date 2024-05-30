"use client"
import { toast } from "react-toastify";

const initiatePayment = async (data,clearCart) => {
    // console.log(data);
  // Get a transaction token
  const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pretransaction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log(a);
  const txnRes = await a.json();

  if (!txnRes.error || txnRes.success) {
    const txnToken = txnRes.token;

    var config = {
      root: "",
      flow: "DEFAULT",
      data: {
        orderId: oid /* update order id */,
        token: txnToken /* update token value */,
        tokenType: "TXN_TOKEN",
        amount: subTotal /* update amount */,
      },
      handler: {
        notifyMerchant: function (eventName, data) {
          console.log("notifyMerchant handler function called");
          console.log("eventName => ", eventName);
          console.log("data => ", data);
        },
      },
    };

    // initialze configuration using init method
    window.Paytm.CheckoutJS.init(config)
      .then(function onSuccess() {
        // after successfully updating configuration, invoke JS Checkout
        window.Paytm.CheckoutJS.invoke();
      })
      .catch(function onError(error) {
        console.log("error => ", error);
      });
  } else {
    console.log(txnRes.message);
    // console.log(txnRes.clearcart);
    if (txnRes.clearcart) {
        clearCart();
    }
    toast.error(txnRes.message);
  }
};

export default initiatePayment;
