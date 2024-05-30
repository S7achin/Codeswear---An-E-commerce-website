import connectDb from "../../../middleware/mongoose"
import Product from "../../../models/Product"

export async function GET(req, res) {
  await connectDb();
  const products = await Product.find();
  
  return Response.json({ products });


  // const searchParams = req.nextUrl.searchParams;
  // const category = searchParams.get("category");
  // console.log(searchParams);
  // console.log(category);
}



// const handler = async (req,res) =>{
//     const products = await Product.find();
//     return Response.json({products})
//   }

// export default connectDb(GET);