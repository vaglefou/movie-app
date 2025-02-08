import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BaseResponse, fromFailed } from "../common/utils/base-response.utils";
import { AuthenticatedRequest } from "../common/types/middleware-request.types";

/**
 * Middleware function to authenticate requests using JWT.
 * It checks for a valid JWT token in the Authorization header.
 * If the token is valid, it attaches the decoded payload to the request object.
 * If the token is invalid or missing, it returns a 401 Unauthorized response.
 */

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Validating the token
      token = req.headers.authorization.split(" ")[1];
      const decodedJwt = jwt.decode(token, { complete: true });

      if (!decodedJwt) {
        const responseObj: BaseResponse = fromFailed("Not a valid JWT token");
        res.status(401).json(responseObj);
        return;
      }
      req.user = decodedJwt.payload;

      next();
    } catch (error) {
      const responseObj: BaseResponse = fromFailed("Not authorized");
      res.status(401).json(responseObj);
      return;
    }
  } else {
    const responseObj: BaseResponse = fromFailed("Not Authorized & No Token");
    res.status(401).json(responseObj);
  }
};

export { authMiddleware };
