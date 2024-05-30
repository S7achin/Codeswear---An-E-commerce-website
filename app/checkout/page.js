"use client";

import { useAuth } from "../../context/store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsBagCheckFill } from "react-icons/bs";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import Head from "next/head";
import Script from "next/script";
// import makePayment from "./paytmgateway";
import makePayment from "./razorpayPaymentInit";

const checkout = () => {
  const { cart, subTotal, addToCart, removeFromCart, clearCart, user } =
    useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const getUser = async () => {
    const data = { token: user.value };
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    console.log(msg);
    const { name, email, phone, address, pincode } = msg;
    setName(name);
    setPhone(phone);
    setAddress(address);
    setPincode(pincode);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("myuser"));
    if (user) {
      setEmail(user.email);
      if (user.value && email) {
        getUser();
      }
    }
  }, [email]);

  const fetchByPincode = async () => {
    const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    const pinList = await pins.json();
    console.log(pinList);
    if (Object.keys(pinList).includes(pincode)) {
      setCity(pinList[pincode][0]);
      setState(pinList[pincode][1]);
    } else {
      setCity("");
      setState("");
    }
  };

  useEffect(() => {
    if (
      name.length > 3 &&
      email.length > 3 &&
      address.length > 3 &&
      phone.length > 3 &&
      pincode.length > 3
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    if (pincode.length == 6) {
      fetchByPincode();
    }
  }, [name, email, phone, address, pincode]);

  const handleChange = async (e) => {
    if (e.target.name == "name") {
      setName(e.target.value);
    } else if (e.target.name == "email") {
      setEmail(e.target.value);
    } else if (e.target.name == "address") {
      setAddress(e.target.value);
    } else if (e.target.name == "phone") {
      setPhone(e.target.value);
    } else if (e.target.name == "pincode") {
      setPincode(e.target.value);
    } else if (e.target.name == "city") {
      setCity(e.target.value);
    } else if (e.target.name == "state") {
      setState(e.target.value);
    }
  };

  // initiate payment logic using paytm SDK
  let oid = Math.floor(Math.random() * Date.now());
  const data = {
    cart,
    subTotal,
    oid,
    email: email,
    name,
    address,
    phone,
    city,
    state,
    pincode,
  };

  return (
    <>
      <Head>
      <title>Checkout - Codeswear.com</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div className="container m-auto min-h-screen">
        <Script
          type="application/javascript"
          src={`${process.env.NEXT_PUBLIC_PAYTM_HOST}/merchantpgpui/checkoutjs/merchants/${process.env.NEXT_PUBLIC_PAYTM_MID}.js`}
        />

        <h1 className="font-bold text-2xl md:text-3xl my-8 text-center">
          Checkout
        </h1>

        <div className="px-6 lg:px-28">
          <h2 className="font-semibold text-xl">1. Delivery details</h2>
          <div className="mx-auto md:flex my-2">
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="leading-7 text-sm text-gray-600"
                >
                  Name
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={name}
                  id="name"
                  name="name"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="leading-7 text-sm text-gray-600"
                >
                  Email
                </label>

                {user.email ? (
                  <input
                    value={user.email}
                    readOnly={true}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                ) : (
                  <input
                    onChange={handleChange}
                    value={email}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="px-2 w-full">
            <div className="mb-4">
              <label
                htmlFor="address"
                className="leading-7 text-sm text-gray-600"
              >
                Address
              </label>
              <textarea
                onChange={handleChange}
                value={address}
                name="address"
                id="address"
                cols="30"
                rows="2"
                className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>
          </div>
          <div className="mx-auto md:flex my-2">
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="leading-7 text-sm text-gray-600"
                >
                  Phone Number
                </label>
                <input
                  onChange={handleChange}
                  value={phone}
                  placeholder="Your 10 Digit Phone Number"
                  type="text"
                  id="phone"
                  name="phone"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="pincode"
                  className="leading-7 text-sm text-gray-600"
                >
                  PinCode
                </label>
                <input
                  onChange={handleChange}
                  value={pincode}
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto md:flex my-2">
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="leading-7 text-sm text-gray-600"
                >
                  City
                </label>
                <input
                  onChange={handleChange}
                  value={city}
                  type="text"
                  id="city"
                  name="city"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="state"
                  className="leading-7 text-sm text-gray-600"
                >
                  State
                </label>
                <input
                  onChange={handleChange}
                  value={state}
                  type="text"
                  id="state"
                  name="state"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-28">
          <h2 className="font-semibold text-xl">2. Review Cart Items & Pay</h2>
          <div className="sideCart bg-pink-100 p-6 my-4">
            <ol className="list-decimal font-semibold">
              {Object.keys(cart).length == 0 && (
                <div className="my-4 font-semibold">Your cart is Empty!</div>
              )}

              {Object.keys(cart).map((k) => {
                return (
                  <li key={k}>
                    <div className="item flex my-5 justify-between">
                      <div className="font-semibold">
                        {cart[k].name} ({cart[k].size}/{cart[k].variant})
                      </div>
                      <div className="w-1/3 flex items-center justify-center font-semibold text-md lg:mr-64">
                        <FaCircleMinus
                          onClick={() => {
                            removeFromCart(
                              k,
                              1,
                              cart[k].price,
                              cart[k].name,
                              cart[k].size,
                              cart[k].variant
                            );
                          }}
                          className="text-pink-500 cursor-pointer"
                        />
                        <span className="mx-2 text-sm">{cart[k].qty}</span>
                        <FaCirclePlus
                          onClick={() => {
                            addToCart(
                              k,
                              1,
                              cart[k].price,
                              cart[k].name,
                              cart[k].size,
                              cart[k].variant
                            );
                          }}
                          className="text-pink-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <span className="font-bold">SubTotal : ₹{subTotal}</span>
          </div>
          <div className="mx-4">
            <Link href={"/checkout"}>
              <button
                disabled={disabled}
                onClick={() => makePayment(data, clearCart)}
                // onClick={()=> makePayment({ productId: "example_ebook" })}
                className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm items-center"
              >
                <BsBagCheckFill className="m-1" />
                Pay ₹{subTotal}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default checkout;
