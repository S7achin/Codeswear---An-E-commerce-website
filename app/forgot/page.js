"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Forgot = ({ searchParams }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/");
    }
    console.log(searchParams.token);
  }, []);

  const resetPassword = async () => {
    const data = {
      token: searchParams.token,
      sendMail: false,
      password,
      cpassword,
    };
    if (password == cpassword) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const msg = await res.json();
      console.log(msg);
      if (msg.success) {
        toast.success(msg.message);
        setPassword("");
        setCpassword("");
        router.push("/login");
      } else {
        toast.error(msg.message);
      }
    }
  };

  const sendResetEmail = async () => {
    const data = { email, sendMail: true };
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/forgot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    console.log(msg);
    if (msg.success) {
      toast.success(msg.message);
      setEmail("");
      router.push("/");
    } else {
      toast.error(msg.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-16 my-10 md:my-6 md:py-24 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto mt-8 h-10 w-auto"
          src="/logo2.png"
          alt="Your Company"
        />
        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot password
        </h2>
      </div>

      {searchParams.token && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            New Password
          </label>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
              placeholder="New Password"
            />
          </div>
          <div>
            <label
              htmlFor="cpassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm New Password
            </label>
            <div className="mt-2">
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                onChange={(e) => setCpassword(e.target.value)}
                value={cpassword}
                required
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                placeholder="Confirm New Password"
              />
            </div>
          </div>
          {password !== cpassword && (
            <span className="text-red-600">Passwords not match</span>
          )}
          {password && password === cpassword && (
            <span className="text-green-600">Passwords match</span>
          )}

          <div className="my-5">
            <button
              type="submit"
              onClick={resetPassword}
              // disabled={password !== cpassword}
              className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {!searchParams.token && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div className="my-5">
            <button
              type="submit"
              onClick={sendResetEmail}
              className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Continue
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember your password?
            <Link
              href={"/login"}
              className="font-semibold leading-6 text-pink-600 hover:text-pink-500"
            >
              {" "}
              Login
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default Forgot;
