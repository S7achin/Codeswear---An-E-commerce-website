import connectDb from "../../middleware/mongoose";
import Product from "../../models/Product";
import Link from "next/link";
import React from "react";

const getStickers = async () => {
  await connectDb();
  const products = await Product.find({category:"sticker"});
  // console.log("checking",products);
  let stickers = {}
  for(let item of products){
    if(item.title in stickers){
        if(item.title in stickers){
          if(!stickers[item.title].color.includes(item.color) && item.availableQty > 0){
            stickers[item.title].color.push(item.color);
          }
          if(!stickers[item.title].size.includes(item.size) && item.availableQty > 0){
            stickers[item.title].size.push(item.size);
          }
        }
    }
    else{
        stickers[item.title] = JSON.parse(JSON.stringify(item));
        if(item.availableQty > 0){
          stickers[item.title].color = [item.color];
          stickers[item.title].size = [item.size];
        }
    }
  }
  // console.log(stickers);
  return Response.json(stickers)
};

const Stickers = async() => {
  const products = await getStickers();
  const stickers = await products.json();
  // console.log(stickers);
  return (
    <div>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap md:pl-24">
          {Object.keys(stickers).length === 0 && <p className="m-auto mx-5">Sorry all the Stickers are currently out of stock. New Stock coming soon. Stay Tuned!</p>}
            {Object.keys(stickers).map((item)=>{
              return <Link passHref={true} key={stickers[item]._id} href={`/products/${stickers[item].slug}`} legacyBehavior>
              <div className="lg:w-1/5 md:w-1/3 p-4 w-full cursor-pointer shadow-lg m-5">
                <div>
                  <img
                    alt="ecommerce"
                    className="m-auto h-[30vh] md:h-[36vh] block"
                    src={stickers[item].img}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                    T-Shirts
                  </h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">
                    {item}
                  </h2>
                  <p className="mt-1">₹{stickers[item].price}</p>

                  <div className="mt-1">
                  {stickers[item].size.includes("S") && <span className="border border-gray-300 px-1 mx-1">S</span>}
                  {stickers[item].size.includes("M") && <span className="border border-gray-300 px-1 mx-1">M</span>}
                  {stickers[item].size.includes("L") && <span className="border border-gray-300 px-1 mx-1">L</span>}
                  {stickers[item].size.includes("XL") && <span className="border border-gray-300 px-1 mx-1">XL</span> }
                  {stickers[item].size.includes("XXL") && <span className="border border-gray-300 px-1 mx-1">XLL</span>}
                  </div>
                  
                  <div className="mt-1">
                  {stickers[item].color.includes("blue") && <button className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {stickers[item].color.includes("pink") && <button className="border-2 border-gray-300 ml-1 bg-pink-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {stickers[item].color.includes("green") && <button className="border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {stickers[item].color.includes("red") && <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button> }
                  {stickers[item].color.includes("yellow") && <button className="border-2 border-gray-300 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {stickers[item].color.includes("purple") && <button className="border-2 border-gray-300 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {stickers[item].color.includes("black") && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
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


export default Stickers;
