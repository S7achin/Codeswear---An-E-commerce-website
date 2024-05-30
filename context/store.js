"use client";
import connectDb from "../middleware/mongoose";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const connetToDB = async () => {
    await connectDb();
    // console.log("Connected to DB");
  };

  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [user, setUser] = useState({ value: null });
  // const [key, setKey] = useState(0);
  const [triggerCart, setTriggerCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    const keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    // localStorage.setItem("SubTotal", subt);
    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    const myCart = cart;
    if (itemCode in cart) {
      myCart[itemCode].qty += qty;
    } else {
      myCart[itemCode] = { qty: 1, price, name, size, variant };
    }
    setCart(myCart);
    setTriggerCart(true);
    // console.log(myCart);
    saveCart(myCart);
  };


  const buyNow = (itemCode, qty, price, name, size, variant) => {
    saveCart({});
    let myCart ={}
    myCart[itemCode] =  { qty: 1, price, name, size, variant };
    setCart(myCart);
    // console.log(myCart);
    saveCart(myCart);
    router.push("/checkout");
  };

  const logout = () => {
    localStorage.removeItem("myuser");
    setUser({ value: null });
    // setKey(Math.random());
    router.push("/");
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
    setTriggerCart(false);
    // console.log("cart has been cleared");
  };

  const removeFromCart = (itemCode, qty, price, name, size, variant) => {
    const myCart = cart;
    if (itemCode in cart) {
      myCart[itemCode].qty -= qty;
      if (myCart[itemCode].qty <= 0) {
        delete myCart[itemCode];
      }
    }
    setCart(myCart);
    saveCart(myCart);
  };

  useEffect(() => {
    // console.log("I am useEffect from layout.js");
    connetToDB();
    try {
      if (localStorage.getItem("cart")) {
        let subt = 0;
        let myCart = JSON.parse(localStorage.getItem("cart"));
        setCart(myCart);
        const keys = Object.keys(myCart);
        for (let i = 0; i < keys.length; i++) {
          subt += myCart[keys[i]].price * myCart[keys[i]].qty;
        }
        setSubTotal(subt);
        // setSubTotal(parseInt(localStorage.getItem("SubTotal")));
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem('cart');
    }
  }, []);

  const getUserAdmin = async (data, value, email)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getuser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    // console.log(msg);
    setUser({value, email, isAdmin: msg.isAdmin });
    // console.log(user);
  }

  useEffect(() => {
    try {
      const myuser = JSON.parse(localStorage.getItem("myuser"));
      if (myuser) {
        // setUser({ value: myuser.value, email: myuser.email });
        const data = { token: myuser.value };
        getUserAdmin(data,  myuser.value, myuser.email);
      }
    } catch (error) {
      console.log(error);
      localStorage.clear();
    }
  }, [pathname]);

  return (
    <AuthContext.Provider
      value={{
        cart,
        subTotal,
        // key,
        triggerCart,
        user,
        isAdmin,
        setIsAdmin,
        addToCart,
        removeFromCart,
        clearCart,
        buyNow,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth used outside of the Provider");
  }

  return authContextValue;
};
