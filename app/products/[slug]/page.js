"use server"

const { default: Product } = require("../../../models/Product");
import connectDb from "../../../middleware/mongoose";
import Page from "./client";

const getProduct = async ({params})=> {
    await connectDb();
    let error;
    const product = await Product.findOne({slug : params.slug});
    if(product == null){
      return(
        <Page error={404}/>
      )
    }
    const variant = await Product.find({title: product.title, category: product.category});
    // console.log(product);
    // console.log(variant);

    let colorSizeSlug = {}; //{red: {xl: {slug: 'wear-the-code'}}}

    for(let item of variant){
        if(Object.keys(colorSizeSlug).includes(item.color)){
            colorSizeSlug[item.color][item.size] = {slug: item.slug};
        }
        else{
            colorSizeSlug[item.color] = {}
            colorSizeSlug[item.color][item.size] = {slug: item.slug};
        }
    }

    // console.log(colorSizeSlug);
    

    return(
      <Page product={JSON.stringify(product)} variants={JSON.stringify(colorSizeSlug)}/>
    )
  }

export default getProduct;