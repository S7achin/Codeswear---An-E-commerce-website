"use client";
import { useAuth } from "../../context/store";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MyAccount = () => {
  const { user, logout, isAdmin} = useAuth();
  console.log(isAdmin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [disabledPassword, setDisabledPassword] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [cpassword, setCpassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");

  const handleChange = async (e) => {
    setDisabled(false);
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
    } else if (e.target.name == "oldpassword") {
      setOldPassword(e.target.value);
    } else if (e.target.name == "password") {
      setPassword(e.target.value);
      if (e.target.value == cpassword) {
        setDisabledPassword(false);
      } else {
        setDisabledPassword(true);
      }
    } else if (e.target.name == "cpassword") {
      setCpassword(e.target.value);
      if (e.target.value == password) {
        setDisabledPassword(false);
      } else {
        setDisabledPassword(true);
      }
    }
  };

  const handleUserSubmit = async () => {
    const data = { token: user.value, name, phone, address, pincode };
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateuser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    if (msg.success) {
      toast.success(msg.message);
      setDisabled(true);
    } else {
      toast.error("Something went wrong, Please try again later!");
    }
  };

  const handlePasswordSubmit = async () => {
    const data = { token: user.value, oldpassword, password, cpassword };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/updatepassword`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const msg = await res.json();
    if (msg.success) {
      toast.success(msg.message);
      setOldPassword("");
      setPassword("");
      setCpassword("");
      setDisabledPassword(true);
    } else {
      if (msg.message) {
        toast.error(msg.message);
      } else {
        toast.error("Something went wrong, Please try again later!");
      }
    }
  };

  const getUser = async () => {
    const data = { token: user.value };
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    console.log(msg);
    if (msg.error) {
      toast.error(msg.error);
      logout();
    } else {
      const { name, email, phone, address, pincode } = msg;
      setName(name);
      setPhone(phone);
      setAddress(address);
      setPincode(pincode);
    }
  };

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    }
    if (user) {
      setEmail(user.email);
      // console.log(user);
      if (user.value && email) {
        getUser();
      }
    }
  }, [email]);

  return (
    <>
      {" "}
      <Head>
        <title>Checkout - Codeswear.com</title>
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0"
        />
      </Head>
      <div className="container my-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center my-8">
          Update your Account
        </h1>
        <div className="px-6 lg:px-28">
          <h2 className="font-semibold text-xl">1. Profile Details</h2>
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
                  Email (Cannot be Updated)
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
          <button
            disabled={disabled}
            onClick={handleUserSubmit}
            className="disabled:bg-pink-300 flex m-2 mb-5 text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded text-sm items-center"
          >
            Submit Details
          </button>
          <h2 className="font-semibold text-xl">2. Change Password</h2>
          <div className="mx-auto md:flex my-2">
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="oldpassword"
                  className="leading-7 text-sm text-gray-600"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  onChange={handleChange}
                  value={oldpassword}
                  id="oldpassword"
                  name="oldpassword"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="leading-7 text-sm text-gray-600"
                >
                  New Password
                </label>
                <input
                  type="password"
                  onChange={handleChange}
                  value={password}
                  id="password"
                  name="password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div className="px-2 md:w-1/2">
              <div className="mb-4">
                <label
                  htmlFor="cpassword"
                  className="leading-7 text-sm text-gray-600"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  onChange={handleChange}
                  value={cpassword}
                  id="cpassword"
                  name="cpassword"
                  className="w-full bg-white rounded border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
          </div>
          <button
            disabled={disabledPassword}
            onClick={handlePasswordSubmit}
            className="disabled:bg-pink-300 flex m-2 text-white bg-pink-500 border-0 py-2 px-4 focus:outline-none hover:bg-pink-600 rounded text-sm items-center"
          >
            Update Password
          </button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
