import connectDb from "../../middleware/mongoose";
import Product from "../../models/Product";
import Link from "next/link";
import React from "react";

const getMugs = async () => {
  await connectDb();
  const products = await Product.find({category:"mug"});
  // console.log("checking",products);
  let mugs = {}
  for(let item of products){
    if(item.title in mugs){
        if(item.title in mugs){
          if(!mugs[item.title].color.includes(item.color) && item.availableQty > 0){
            mugs[item.title].color.push(item.color);
          }
          if(!mugs[item.title].size.includes(item.size) && item.availableQty > 0){
            mugs[item.title].size.push(item.size);
          }
        }
    }
    else{
        mugs[item.title] = JSON.parse(JSON.stringify(item));
        if(item.availableQty > 0){
          mugs[item.title].color = [item.color];
          mugs[item.title].size = [item.size];
        }
    }
  }
  // console.log(mugs);
  return Response.json(mugs)
};

const Mugs = async() => {
  const products = await getMugs();
  const mugs = await products.json();
  // console.log(mugs);
  return (
    <div>
      <section className="text-gray-600 body-font min-h-screen">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4 md:pl-24">
          {Object.keys(mugs).length === 0 && <p className="md:m-auto  mx-5">Sorry all the mugs are currently out of stock. New Stock coming soon. Stay Tuned!</p>}
            {Object.keys(mugs).map((item)=>{
              return <Link passHref={true} key={mugs[item]._id} href={`/products/${mugs[item].slug}`} legacyBehavior>
              <div className="lg:w-1/5 md:w-1/3 p-4 w-full cursor-pointer shadow-lg m-5">
                <div>
                  <img
                    alt="ecommerce"
                    className="m-auto h-[30vh] md:h-[36vh] block"
                    src={mugs[item].img}
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                    mugs
                  </h3>
                  <h2 className="text-gray-900 title-font text-lg font-medium">
                    {item}
                  </h2>
                  <p className="mt-1">₹{mugs[item].price}</p>

                  <div className="mt-1">
                  {mugs[item].size.includes("S") && <span className="border border-gray-300 px-1 mx-1">S</span>}
                  {mugs[item].size.includes("M") && <span className="border border-gray-300 px-1 mx-1">M</span>}
                  {mugs[item].size.includes("L") && <span className="border border-gray-300 px-1 mx-1">L</span>}
                  {mugs[item].size.includes("XL") && <span className="border border-gray-300 px-1 mx-1">XL</span> }
                  {mugs[item].size.includes("XXL") && <span className="border border-gray-300 px-1 mx-1">XLL</span>}
                  </div>
                  
                  <div className="mt-1">
                  {mugs[item].color.includes("blue") && <button className="border-2 border-gray-300 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {mugs[item].color.includes("pink") && <button className="border-2 border-gray-300 ml-1 bg-pink-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {mugs[item].color.includes("green") && <button className="border-2 border-gray-300 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {mugs[item].color.includes("red") && <button className="border-2 border-gray-300 ml-1 bg-red-500 rounded-full w-6 h-6 focus:outline-none"></button> }
                  {mugs[item].color.includes("yellow") && <button className="border-2 border-gray-300 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {mugs[item].color.includes("purple") && <button className="border-2 border-gray-300 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none"></button>}
                  {mugs[item].color.includes("black") && <button className="border-2 border-gray-300 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none"></button>}
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


export default Mugs;
