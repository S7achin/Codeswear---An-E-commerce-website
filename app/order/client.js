"use client";
import { useAuth } from "../../context/store";
import React, { useEffect, useState } from "react";

const Order = ({ order, clearcart }) => {
  const { clearCart } = useAuth();
  const [date, setDate] = useState();

  useEffect(() => {
    const d = new Date(order.createdAt);
    setDate(d);
    if (clearcart == "1") {
      clearCart();
      // console.log("cart is cleared");
    }
  }, []);
  // console.log(order);
  const products = order.products;
  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-2/3 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">
              CODESWEAR.COM
            </h2>
            <h1 className="text-gray-900 text-xl md:text-3xl title-font font-medium mb-4">
              Order Id: #{order.orderId}
            </h1>
            <p className="leading-relaxed mb-2">
              Yayy! Your order has been successfully placed.
            </p>
            <p className="leading-relaxed mb-2">
              Order placed on:{" "}
              {date &&
                date.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </p>
            <span>Your Payment Status is: </span>
            <span className="font-bold"> {order.status}</span>
            <div className="flex my-4">
              <a className="flex-grow w-2/4 py-2 text-lg px-1">Description</a>
              <a className="flex-grow w-1/4 text-center border-gray-300 py-2 text-lg px-1">
                Quantity
              </a>
              <a className="flex-grow w-1/4 text-center border-gray-300 py-2 text-lg px-1">
                Item Total
              </a>
            </div>

            {Object.keys(products).map((item) => {
              return (
                <div key={item} className="flex border-t border-gray-200 py-2">
                  <span className="text-gray-900 w-2/4 text-start">
                    {products[item].name} ({products[item].size}/
                    {products[item].variant})
                  </span>
                  <span className="mx-auto text-gray-900 w-1/4 text-center">
                    {products[item].qty}
                  </span>
                  <span className="mx-auto text-gray-900 w-1/4 text-center">
                    ₹{products[item].price} X {products[item].qty} = ₹
                    {products[item].price * products[item].qty}
                  </span>
                </div>
              );
            })}

            <div className="flex flex-col mt-8">
              <span className="title-font font-medium text-2xl text-gray-900">
                SubTotal: ₹{order.amount}.00
              </span>
              <div className="my-3">
                <button className="flex mx-0 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded">
                  Track Order
                </button>
              </div>
            </div>
          </div>
          <img
            alt="ecommerce"
            className="lg:w-1/3 w-full lg:h-auto h-64  rounded"
            src="/order.jpeg"
          />
        </div>
      </div>
    </section>
  );
};

export default Order;
