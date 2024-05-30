"use client";
import { useAuth } from "../../../context/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Error from "next/error";

const Page = ({ product, variants, error }) => {
  console.log(error);
  const router = useRouter();
  const pathname = usePathname();

  if (error == 404) {
    return<Error statusCode={404} />;
  }

  product = JSON.parse(product);
  variants = JSON.parse(variants);
  // console.log(product);
  // console.log(variants);

  const [color, setColor] = useState(product.color);
  const [size, setSize] = useState(product.size);
  // console.log(color, size, product.img);

  const { cart, subTotal, addToCart, removeFromCart, buyNow } = useAuth();
  const [pin, setPin] = useState();
  const [service, setService] = useState();

  useEffect(() => {
    console.log(product.availableQty);
    setColor(product.color);
    setSize(product.size);
  }, [pathname]);

  const checkServicability = async () => {
    const pins = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
    const pinList = await pins.json();
    if (Object.keys(pinList).includes(pin)) {
      setService(true);
      toast.success("Your pincode is servicable");
    } else {
      setService(false);
      toast.error("Sorry!, pincode is not servicable");
    }
  };

  const refreshVariant = (newcolor, newsize) => {
    // setSize(newsize)
    let url = `http://localhost:3000/products/${variants[newcolor][newsize]["slug"]}`;
    // window.location = url;
    router.push(url);
  };

  const onChangePin = (e) => {
    setPin(e.target.value);
  };


  return (
    <>
      <section className="text-gray-600 body-font overflow-hidden min-h-screen">
        <div className="container px-5 py-12 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="xl:px-20 lg:w-1/2 lg:px-4 md:px-10 w-full px-12 object-cover object-top rounded"
              src={product.img}
            />
            {/* lg:w-1/2 xl:px-20 xl:py-8 lg:px-8 md:h-[80vh] md:px-36 w-full sm:px-28 object-cover object-top rounded h-[60vh] px-20 */}
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 flex flex-col justify-center">
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                CODESWEAR
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                {product.title} ({product.size}/{product.color})
              </h1>

              {/* <div className="flex mb-4">
                <span className="flex items-center">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-4 h-4 text-pink-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                  <span className="text-gray-600 ml-3">4 Reviews</span>
                </span>
                <span className="flex ml-3 pl-3 py-2 border-l-2 border-gray-200 space-x-2s">
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                    </svg>
                  </a>
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                    </svg>
                  </a>
                  <a className="text-gray-500">
                    <svg
                      fill="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                    </svg>
                  </a>
                </span>
              </div> */}

              <p className="leading-relaxed">{product.desc}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
                <div className="flex">
                  {product.color && <span className="mr-3">Color</span>}
                  {Object.keys(variants).includes("white") &&
                    Object.keys(variants["white"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("white", size)}
                        className={`border-2 rounded-full w-6 h-6 focus:outline-none ${
                          color === "white" ? "border-black" : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("red") &&
                    Object.keys(variants["red"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("red", size)}
                        className={`border-2 ml-1 bg-red-700 rounded-full w-6 h-6 focus:outline-none ${
                          color === "red" ? "border-black" : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("green") &&
                    Object.keys(variants["green"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("green", size)}
                        className={`border-2 ml-1 bg-green-500 rounded-full w-6 h-6 focus:outline-none ${
                          color === "green" ? "border-black" : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("blue") &&
                    Object.keys(variants["blue"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("blue", size)}
                        className={`border-2 ml-1 bg-blue-500 rounded-full w-6 h-6 focus:outline-none ${
                          color === "blue" ? "border-black" : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("purple") &&
                    Object.keys(variants["purple"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("purple", size)}
                        className={`border-2 ml-1 bg-purple-500 rounded-full w-6 h-6 focus:outline-none ${
                          color === "purple"
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("yellow") &&
                    Object.keys(variants["yellow"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("yellow", size)}
                        className={`border-2 ml-1 bg-yellow-500 rounded-full w-6 h-6 focus:outline-none ${
                          color === "yellow"
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("black") &&
                    Object.keys(variants["black"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("black", size)}
                        className={`border-2 ml-1 bg-black rounded-full w-6 h-6 focus:outline-none ${
                          color === "black" ? "border-black" : "border-gray-300"
                        }`}
                      ></button>
                    )}
                  {Object.keys(variants).includes("pink") &&
                    Object.keys(variants["pink"]).includes(size) && (
                      <button
                        onClick={() => refreshVariant("pink", size)}
                        className={`border-2 ml-1 bg-pink-500 rounded-full w-6 h-6 focus:outline-none ${
                          color === "pink" ? "border-black" : "border-gray-300"
                        }`}
                      ></button>
                    )}
                </div>
                <div className="flex ml-6 items-center">
                  {product.size && <span className="mr-3">Size</span>}
                  <div className={product.size ? "relative" : ""}>
                    {product.size && (
                      <select
                        value={size}
                        onChange={(e) => refreshVariant(color, e.target.value)}
                        className="rounded border appearance-none py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 text-base pl-3 pr-10"
                      >
                        {Object.keys(variants[color]).includes("S") && (
                          <option value={"S"}>S</option>
                        )}
                        {Object.keys(variants[color]).includes("M") && (
                          <option value={"M"}>M</option>
                        )}
                        {Object.keys(variants[color]).includes("L") && (
                          <option value={"L"}>L</option>
                        )}
                        {Object.keys(variants[color]).includes("XL") && (
                          <option value={"XL"}>XL</option>
                        )}
                        {Object.keys(variants[color]).includes("XXL") && (
                          <option value={"XXL"}>XXL</option>
                        )}
                      </select>
                    )}
                    <span className="absolute right-0 top-0 h-full w-10 text-center text-gray-600 pointer-events-none flex items-center justify-center">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex">
                {product.availableQty > 0 && (
                  <span className="title-font font-medium text-2xl text-gray-900">
                    ₹{product.price}
                  </span>
                )}
                {product.availableQty <= 0 && (
                  <span className="title-font font-medium text-2xl text-gray-900">
                    Out of Stock!
                  </span>
                )}
                <button
                  disabled={product.availableQty <= 0}
                  onClick={() => {
                    buyNow(
                      product.slug,
                      1,
                      product.price,
                      product.title,
                      size,
                      color
                    );
                  }}
                  className="disabled:bg-pink-300 flex ml-8 text-white bg-pink-500 border-0 py-2 px-2 md:px-6  focus:outline-none hover:bg-pink-600 rounded text-sm md:text-md"
                >
                  Buy Now
                </button>
                <button
                  disabled={product.availableQty <= 0}
                  onClick={() => {
                    addToCart(
                      product.slug,
                      1,
                      product.price,
                      product.title,
                      size,
                      color
                    );
                  }}
                  className="disabled:bg-pink-300 flex ml-4 text-white bg-pink-500 border-0 py-2 px-2 md:px-6 focus:outline-none hover:bg-pink-600 rounded text-sm md:text-md"
                >
                  Add to Cart
                </button>

                {/* <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                  <svg
                    fill="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                  </svg>
                </button> */}
              </div>

              <div className="pin mt-6 flex space-x-2">
                <input
                  onChange={(e) => onChangePin(e)}
                  className="px-2 border-2 border-gray-400 rounded-md"
                  type="text"
                  placeholder="Check availability"
                />
                <button
                  onClick={checkServicability}
                  className="flex ml-16 text-white bg-pink-500 border-0 py-2 px-6 focus:outline-none hover:bg-pink-600 rounded"
                >
                  Check
                </button>
              </div>

              {!service && service != null && (
                <div className="text-red-700 text-sm mt-2">
                  Sorry! we do not deliver to this pincode yet
                </div>
              )}

              {service && service != null && (
                <div className="text-green-700 text-sm mt-2">
                  yah! This pincode is available for delivery
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
