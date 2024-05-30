import connectDb from "../../middleware/mongoose";
import OrderPage from "./client"
import Order from "../../models/Order";
// import { useSearchParams } from "next/navigation";

const getOrder = async ({searchParams}) => {
  await connectDb();
  console.log(searchParams);
  let order;
  if(searchParams.orderId){
    order = await Order.findOne({orderId : searchParams.orderId});
  }else{
    order = await Order.findById(searchParams.id);
  }

  // console.log(order);
  return (
    <OrderPage order={JSON.parse(JSON.stringify(order))} clearcart={searchParams.clearCart}/>
  )
}

export default getOrder