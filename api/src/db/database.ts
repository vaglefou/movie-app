import mongoose, { ConnectOptions, Mongoose } from "mongoose";
import configurations from "../configurations/configurations";

const CONFIG = configurations();

const connectDb = async (): Promise<Mongoose> => {
  try {
    console.log("DATABASE URI : ", CONFIG.DATABASE.URI);
    const connection = await mongoose.connect(`${CONFIG.DATABASE.URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log(`MongoDB has connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export { connectDb };
