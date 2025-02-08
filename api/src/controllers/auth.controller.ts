import { Request, Response } from "express";
import UserSchema, { IUser } from "../models/user.model";
import UserRoleSchema from "../models/user-role.model";
import { comparePassword, hashPassword } from "../common/utils/bycrypt.utils";
import { decodeJwt, generateJwtToken } from "../common/utils/jwt.utils";
import configurations from "../configurations/configurations";
import { fromSuccess, fromFailed, BaseResponse, } from "../common/utils/base-response.utils";
import { IAuthLogin, IAuthRegister } from "../common/types/auth.types";
import { AuthenticatedRequest } from "../common/types/middleware-request.types";
import { UserRoleEnum } from "../common/enums/user.enum";

//Getting the  configurations
const CONFIG = configurations();

/**
 * @Description  - Register a new user
 * @Route        - POST /api/auth/sign-up
 * @Access       - Public
 * @RequestBody  - { username: string, email: string, password: string }
 * @Response     - Success response with user data or failure message
 * 
 * This controller handles the user registration process. It ensures that all required fields
 * (username, email, password) are provided, checks if the user already exists, and verifies
 * that the user role exists in the system. The password is hashed before being saved to the 
 * database. If the user is successfully registered, a success response is returned, 
 * otherwise, an error message is sent.
 */
export const signUpUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username,  email, password }: IAuthRegister = req.body;

    //Check all the required fields are filled
    if (!username || !email || !password) {
      const responseObj: BaseResponse = fromFailed(
        "Please fill required fields"
      );
      res.status(400).json(responseObj);
      return;
    }

    //Check the user already exists
    const userExist = await UserSchema.findOne({ email });
    if (userExist) {
      const responseObj: BaseResponse = fromFailed("User already exists");
      res.status(400).json(responseObj);
      return;
    }

    //Check the user role already exists
    const userRole = await UserRoleSchema.findOne({ name: UserRoleEnum.USER });
    if (!userRole) {
      const responseObj: BaseResponse = fromFailed(
        "User role doesn't exist. Please check the user role again."
      );
      res.status(400).json(responseObj);
      return;
    }

    //Hashing the password
    const hashedPassword = await hashPassword(password);

    //Saving data to the database
    const registeredUser = await UserSchema.create({
      username: username,
      email: email,
      role: userRole.name,
      password: hashedPassword,
    });

    //Returning the user data in response
    if (registeredUser) {
      const responseObj: BaseResponse = fromSuccess(
        "User registered successfully.",
        {
          _id: registeredUser.id,
          username: registeredUser.username,
          email: registeredUser.email,
          role: registeredUser.role,
        }
      );
      res.status(201).json(responseObj);
      return;
    } else {
      const responseObj: BaseResponse = fromFailed("Invalid user data");
      res.status(400).json(responseObj);
      return;
    }
  } catch (error: any) {
    const responseObj: BaseResponse = fromFailed(error.message);
    res.status(500).json(responseObj);
    throw new Error(error);
  }
};


/**
 * @Description  - Login an existing user
 * @Route        - POST /api/auth/sign-in
 * @Access       - Public
 * @RequestBody  - { email: string, password: string }
 * @Response     - Success response with JWT token and user data or failure message
 * 
 * This controller manages the login process for an existing user. It checks if the email 
 * provided exists in the system and verifies the password against the stored hash. 
 * If the credentials match, a JWT token is generated for the user. If there are any issues 
 * (e.g., invalid credentials), an error message is returned.
 */
export const signInUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password }: IAuthLogin = req.body;

    // Check for user email
    const user = await UserSchema.findOne({ email });
    if (!user) {
      const responseObj: BaseResponse = fromFailed(
        "There is no user associated with this email"
      );
      res.status(400).json(responseObj);
      return;
    }

    const isMatchPassword = await comparePassword(password, user.password);
    if (isMatchPassword) {
      const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const responseObj: BaseResponse = fromSuccess("User login successfully", {
        token: generateJwtToken(tokenData),
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
      res.status(200).json(responseObj);
      return;
    } else {
      const responseObj: BaseResponse = fromFailed("Invalid credentials");
      res.status(400).json(responseObj);
      return;
    }
  } catch (error: any) {
    const responseObj: BaseResponse = fromFailed(error.message);
    res.status(500).json(responseObj);
    throw new Error(error);
  }
};


/**
 * @Description  - Get the logged-in user's details
 * @Route        - PUT /api/auth
 * @Access       - Protected
 * @Response     - Success response with user details
 * 
 * This controller retrieves the details of the logged-in user. It uses the authentication 
 * middleware to verify the user's identity and fetches their data from the database. 
 * The user details (ID, username, email, and role) are returned in the response.
 */
export const getLoggedInUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const user = req.user;

    // Check if the requested token user is available in the DB or not
    const existingUser = await UserSchema.findById(user.id);

    const data = {
      id: existingUser?._id,
      username: existingUser?.username,
      email: existingUser?.email,
      role: existingUser?.role
    };

    const responseObj: BaseResponse = fromSuccess(
      "User retrieved successfully",
      data
    );
    res.status(200).json(responseObj);
  } catch (error: any) {
    const responseObj: BaseResponse = fromFailed(error.message);
    res.status(500).json(responseObj);
    throw new Error(error);
  }
};
