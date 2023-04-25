import mongoose from "mongoose";
//database connection
export function MongoConnect() {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.MONGO_URL, connectionParams);
    console.log("Connected to Mongo");
  } catch (error) {
    console.log(error);
  }
}

