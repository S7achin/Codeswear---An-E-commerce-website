"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosCloseCircle } from "react-icons/io";
import { BsBagCheckFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { useAuth } from "../context/store";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const {
    cart,
    subTotal,
    addToCart,
    removeFromCart,
    clearCart,
    user,
    logout,
    triggerCart,
    // isAdmin
  } = useAuth();
  const [dropDown, setDropDown] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  // console.log(user);

  const toggleCart = () => {
    setSidebar(!sidebar);
    // if (ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-full");
    //   ref.current.classList.add("translate-x-0");
    // } else if (!ref.current.classList.contains("translate-x-full")) {
    //   ref.current.classList.remove("translate-x-0");
    //   ref.current.classList.add("translate-x-full");
    // }
  };

  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true);
    let exempted = ["/checkout", "/orders", "/order", "/myaccount"];
    if (exempted.includes(pathname)) {
      setSidebar(false);
    }
  }, []);

  useEffect(() => {
    setSidebar(triggerCart);
  }, [triggerCart]);

  const ref = React.useRef();
  return (
    <navbar>
      <span>
        {dropDown && (
          <div
            onMouseOver={() => setDropDown(true)}
            onMouseLeave={() => setDropDown(false)}
            className="absolute right-16 top-10 py-4 bg-white text-black shadow-lg border rounded-md px-5 w-32 z-30"
          >
            <ul>
              <Link href={"/myaccount"}>
                <li className="py-1 text-sm hover:text-pink-700 font-bold">
                  My Account
                </li>
              </Link>
              <Link href={"/orders"}>
                <li className="py-1 text-sm hover:text-pink-700 font-bold">
                  My Orders
                </li>
              </Link>
              <button>
                <li
                  onClick={() => {
                    logout();
                    setDropDown(false);
                  }}
                  className="py-1 text-sm hover:text-pink-700 font-bold"
                >
                  Logout
                </li>
              </button>
            </ul>
          </div>
        )}
      </span>
      <div
        className={`flex justify-center md:justify-start flex-col md:flex-row items-center py-2 shadow-md sticky top-0 bg-white z-10 ${
          !sidebar && "overflow-hidden"
        }`}
      >
        <div className="logo mr-auto mx-5 md:mr-5">
          <Link href={"/"}>
            <Image src="/logo.png" alt="logo" height={80} width={200} />
          </Link>
        </div>
        <div className="nav">
          <ul className="flex items-center space-x-4 text-black font-bold md:text-md">
            <Link href={"/tShirts"}>
              <li className="hover:text-pink-600">Tshirts</li>
            </Link>
            <Link href={"/hoodies"}>
              <li className="hover:text-pink-600">Hoodies</li>
            </Link>
            <Link href={"/stickers"}>
              <li className="hover:text-pink-600">Stickers</li>
            </Link>
            <Link href={"/mugs"}>
              <li className="hover:text-pink-600">Mugs</li>
            </Link>
          </ul>
        </div>
        {user.isAdmin && (
          <Link href={"/admin"}>
            <span className="hover:text-pink-600 absolute right-28 top-5 font-bold">
              Admin
            </span>
          </Link>
        )}
        <div className="cart absolute text-black right-0 mx-5 top-4 flex items-center">
          <span
            onMouseOver={() => setDropDown(true)}
            onMouseLeave={() => setDropDown(false)}
          >
            {user.value && (
              <MdAccountCircle className="cursor-pointer text-2xl md:text-3xl mx-2" />
            )}
          </span>
          {!user.value && (
            <Link href={"/login"}>
              <button className="bg-pink-600 px-2 py-1 rounded-md text-sm text-white mx-2">
                Login
              </button>
            </Link>
          )}
          <button>
            <AiOutlineShoppingCart
              onClick={toggleCart}
              className="text-2xl md:text-3xl"
            />
          </button>
        </div>

        <div
          ref={ref}
          className={`w-72 h-[100vh] overflow-y-scroll sideCart absolute top-0 bg-pink-100 px-8 py-10 transition-all ${
            sidebar ? "right-0" : "-right-96"
          }`}
        >
          <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-2 right-2 cursor-pointer text-2xl text-pink-500"
          >
            <IoIosCloseCircle className="text-md" />
          </span>
          <ol className="list-decimal font-semibold">
            {Object.keys(cart).length == 0 && (
              <div className="my-4 font-semibold">Your cart is Empty!</div>
            )}

            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex my-5">
                    <div className="w-2/3 font-semibold">
                      {cart[k].name} ({cart[k].size}/{cart[k].variant})
                    </div>
                    <div className="w-1/3 flex items-center justify-center font-semibold text-md">
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

          <div className="font-bold my-2">SubTotal : ₹{subTotal}</div>
          <div className="flex">
            <Link href={"/checkout"}>
              <button
                disabled={Object.keys(cart).length === 0}
                onClick={toggleCart}
                className="disabled:bg-pink-300 flex mr-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm items-center"
              >
                <BsBagCheckFill className="m-1" />
                Checkout
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length === 0}
              onClick={clearCart}
              className="disabled:bg-pink-300 flex mx-2 text-white bg-pink-500 border-0 py-2 px-2 focus:outline-none hover:bg-pink-600 rounded text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </navbar>
  );
};

export default Navbar;
