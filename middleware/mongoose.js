import mongoose from "mongoose";

const URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    // if (mongoose.connection.readyState == 1) {
    //   return;
    // } else {
    //   await mongoose.connect(URI);
    //   console.log("Connection Successfull to DB");
    // }
    if (mongoose.connection.readyState != 1) {
        await mongoose.connect(URI);
        console.log("Connection Successfull to DB");
    }else{
        // console.log("Connecting to DB...");
        return;
    }
  } catch (error) {
    // console.log(error);
    console.error("database connection failed");
  }
};

export default connectDb;

// const connectDb = handler => async (req, res) => {
//   if (mongoose.connection.readyState) {
//     return handler(req, res);
//   }
//   await mongoose.connect(URI
//     // { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, }
//   );
//   return handler(req, res);
// };
