import jwt from "jsonwebtoken";
import configurations from "../../configurations/configurations";

//Getting the  configurations
const CONFIG = configurations();

// Generate JWT token
const generateJwtToken = (tokenData: any) => {
  return jwt.sign(tokenData, `${CONFIG.JWT.secret}`, {
    expiresIn: 60 * 60 * 24 * 7,
  });
};

// Decode JWT token
const decodeJwt = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, `${CONFIG.JWT.secret}`);
    return decodedToken;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export { generateJwtToken, decodeJwt };
