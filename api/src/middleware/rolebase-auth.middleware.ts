import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt, { DecodeOptions, JwtPayload } from "jsonwebtoken";
import { BaseResponse, fromFailed } from "../common/utils/base-response.utils";

/**
 * Middleware function to authorize requests based on user roles.
 * It checks if the user's role (extracted from the JWT token) is included in the allowed roles.
 * If the user's role is allowed, it calls the next middleware or route handler.
 * If the user's role is not allowed, it returns a 403 Forbidden response.
 * If no valid token is provided, it returns a 401 Unauthorized response.
 *
 * @param allowedRoles - An array of roles that are allowed to access the route.
 * @returns A middleware function that enforces role-based access control.
 */

const roleBaseAuthMiddleware = (allowedRoles: string[]) =>
  asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      let userRole: string | undefined;

      try {
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith("Bearer")
        ) {
          const token = req.headers.authorization.split(" ")[1];
          const decodedJwt = jwt.decode(token, {
            complete: true,
          } as DecodeOptions) as JwtPayload;

          if (!decodedJwt) {
            const responseObj: BaseResponse = fromFailed(
              "Not a valid JWT token"
            );
            res.status(401).json(responseObj);
            throw new Error("Not a valid JWT token");
          }
          userRole = decodedJwt.payload.role;
        }

        if (allowedRoles.includes(userRole as string)) {
          next();
        } else {
          const responseObj: BaseResponse = fromFailed(
            "You don't have access"
          );
          res.status(403).json(responseObj);
        }
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  );

export { roleBaseAuthMiddleware };
