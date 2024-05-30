"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useAuth } from "../../context/store";

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const { logout } = useAuth();

  const getOrders = async () => {
    const a = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/myorders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: JSON.parse(localStorage.getItem("myuser")).value }),
    });

    const res = await a.json();
    if(res.error){
      toast.error(res.error);
      logout();
    }else{
      setOrders(res);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("myuser")) {
      router.push("/");
    } else {
      getOrders();
    }
  }, []);

  return (
    <div>
      <div className="min-h-screen container max-w-7xl mx-auto">
        <h1 className="font-semibold text-2xl text-center p-6">My Orders</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light text-surface">
                  <thead className="border-b border-neutral-200 font-medium">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        #OrderId
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      return (
                        <tr
                          key={order._id}
                          className="border-b border-neutral-20m"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {order.orderId}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {order.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {order.amount}
                          </td>
                          <td className=" px-6 py-4">
                            <button>
                              <Link href={"/order?id=" + order._id}>
                                See Details
                              </Link>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
