import connectDb from "../../middleware/mongoose";
import Product from "../../models/Product";
import Link from "next/link";
import React from "react";

const getHoodies = async () => {
  await connectDb();
  const products = await Product.find({category:"hoodie"});
  // console.log("checking",products);
  let hoodies = {}
  for(let item of products){
    if(item.title in hoodies){
        if(item.title in hoodies){
          if(!hoodies[item.title].color.includes(item.color) && item.availableQty > 0){
            hoodies[item.title].color.push(item.color);
          }
          if(!hoodies[item.title].size.includes(item.size) && item.availableQty > 0){
            hoodies[item.title].size.push(item.size);
          }
        }
    }
    else{
        hoodies[item.title] = JSON.parse(JSON.stringify(item));
        if(item.availableQty > 0){
          hoodies[item.title].color = [item.color];
          hoodies[item.title].size = [item.size];
        }
    }
  }
  // console.log(hoodies);
  return Response.json(hoodies)
};

const hoodies = async() => {
  const products = await getHoodies();
  const hoodies = await products.json();
  // console.log(hoodies);
  return (
    <div>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 md:pl-24">
          {Object.keys(hoodies).length === 0 && <p className="m-auto">Sorry all the Hoodies are currently out of stock. New Stock coming soon. Stay Tuned!</p>}
            {Object.keys(hoodies).map((item)=>{
              return <Link passHref={true} key={hoodies[item]._id} href={`/products/${hoodies[item].slug}`} legacyBehavior>
              <div className="lg:w-1/5 md:w-1/3 p-4 w-full cursor-pointer shadow-lg m-5">
                <div>
                  <img
                    alt="ecommerce"
                    className="m-auto h-[30vh] md:h-[36vh] block"
                    src={hoodies[item].img}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                    Hoodies
                  </h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">
                    {item}
                  </h2>
                  <p className="mt-1">₹{hoodies[item].price}</p>

                  <div className="mt-1">
                  {hoodies[item].size.includes("S") && <span className="border border-gray-300 px-1 mx-1">S</span>}
                  {hoodies[item].size.includes("M") && <span className="border border-gray-300 px-1 mx-1">M</span>}
                  {hoodies[item].size.includes("L") && <span className="border border-gray-300 px-1 mx-1">L</span>}
                  {hoodies[item].size.includes("XL") && <span className="border border-gray-300 px-1 mx-1">XL</span> }
                  {hoodies[item].size.includes("XXL") && <span className="border border-gray-300 px-1 mx-1">XLL</span>}
                  </div>
                  
                  <div className="mt-1">
                  {hoodies[item].color.includes("blue") && <button className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {hoodies[item].color.includes("pink") && <button className="border-2 border-gray-300 ml-1 bg-pink-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {hoodies[item].color.includes("green") && <button className="border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {hoodies[item].color.includes("red") && <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button> }
                  {hoodies[item].color.includes("yellow") && <button className="border-2 border-gray-300 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {hoodies[item].color.includes("purple") && <button className="border-2 border-gray-300 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {hoodies[item].color.includes("black") && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
                  </div>
                </div>
              </div>
            </Link>})
            }
          </div>
        </div>
      </section>
    </div>
  );
};


export default hoodies;
