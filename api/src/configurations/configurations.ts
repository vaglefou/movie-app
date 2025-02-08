import dotenv from "dotenv";

dotenv.config();

export default () => ({
  APP: {
    name: process.env.NAME,
    description: process.env.DESCRIPTION,
    globalPrefix: process.env.GLOBAL_PREFIX,
    version: process.env.API_VERSION,
    port: parseInt(process.env.PORT || "") || 8070,
    clientUrl: process.env.CLIENT_URL,
  },
  DATABASE: {
    URI: process.env.MONGODB_URI,
  },
  JWT: {
    secret: process.env.JWT_SECRET,
  },
  BCRYPT: {
    passwordSalt: parseInt(process.env.PW_SALT || ""),
  },
  OMDB: {
    apiKey: process.env.OMDB_API_KEY,
  },
});
