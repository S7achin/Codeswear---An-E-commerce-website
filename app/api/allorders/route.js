import connectDb from "../../../middleware/mongoose"
import Order from "../../../models/Order"

export async function GET(req, res) {
  await connectDb();
  const orders = await Order.find();
  
  return Response.json({ orders });
}