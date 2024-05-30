'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/store";

const Login = () => {
  const { setIsAdmin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(()=>{
    if(localStorage.getItem("myuser")){
      router.push("/");
    }
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email, password };
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const msg = await res.json();
      console.log(msg);
      if(res.ok){
        // console.log(msg.token);
        localStorage.setItem("myuser",JSON.stringify({value: msg.token, email: msg.email, isAdmin: msg.isAdmin}));
        setEmail("");
        setPassword("");
        toast.success("Login Successfull, Enjoy your shopping");
        if(msg.isAdmin){
          // console.log("setting admin true");
          setIsAdmin(true);
        }
        router.push("/")
      }else{
        toast.error(msg.message);
      }
      // console.log(msg);
    }
    catch(error){
      console.log("Error from Login", error);
      toast.error("Something went wrong...!!");
    }
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-10 md:py-24 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto mt-8 h-10 w-auto"
          src="/logo2.png"
          alt="Your Company"
        />
        <h2 className="mt-1 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href={"/forgot"}
                  className="font-semibold text-pink-600 hover:text-pink-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                id="password"
                name="password"
                type="password"
                required
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?
          <Link
            href={"/signup"}
            className="font-semibold leading-6 text-pink-600 hover:text-pink-500"
          >
            {" "}
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
