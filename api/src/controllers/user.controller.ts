import { Request, Response } from "express";
import UserSchema, { IUser } from "../models/user.model";
import { BaseResponse,fromFailed, fromSuccess} from "../common/utils/base-response.utils";

/**
 * @Description  - Get all users
 * @Route        - GET /api/users
 * @Access       - Private
 * @QueryParams  - { page: string, take: string, search: string, type: string, sortBy: string, sortOrder: string }
 * @Response     - Success response with user list and pagination info or failure message
 * 
 * This controller retrieves all users in the system, supporting pagination, searching, and sorting. 
 * It allows searching by username, email, or role and supports sorting by specific fields. 
 * If no users match the criteria, a success response with an empty list is returned. 
 * If an error occurs, a failure message is sent back.
 */

// Constants for default values
const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_FIELD = "createdAt";
const DEFAULT_SORT_ORDER: 1 | -1 = 1; // ascending

// Utility function to map query parameter to sort field
const getSortField = (sortBy: string): any => {
  const sortFields: { [key: string]: any } = {
    username: "username",
    email: "email",
    role: "role",
    createdAt: "createdAt"
  };
  return sortFields[sortBy] || DEFAULT_SORT_FIELD; // Default to createdAt if sortBy is not found
};

// Utility function to validate and parse query parameters
const getQueryParams = (req: Request) => {
  const page = parseInt(req.query.page as string) || DEFAULT_PAGE;
  const pageSize = parseInt(req.query.take as string) || DEFAULT_PAGE_SIZE;
  const searchQuery = req.query.search as string;
  const type = req.query.type as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder: 1 | -1 =
    req.query.sortOrder === "desc" ? -1 : DEFAULT_SORT_ORDER; 

  return { page, pageSize, searchQuery, type, sortBy, sortOrder };
};
// Query the database using aggregations
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Getting the query parameters
    const { page, pageSize, searchQuery, type, sortBy, sortOrder } =
      getQueryParams(req);

    // Handling the pagination
    const skip = (page - 1) * pageSize;

    // Build the search criteria
    const searchCriteria: any = {};
    if (searchQuery) {
      searchCriteria.$or = [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { role: { $regex: searchQuery, $options: "i" } }
      ];
    }

    // Constructing the aggregation pipeline
    const aggregationPipeline: any[] = [
      { $match: searchCriteria },
      { $skip: skip },
      { $limit: pageSize },
      { $sort: { [getSortField(sortBy)]: sortOrder } },
      {
        $project: {
          username: 1,
          email: 1,
          role: 1,
          createdAt: 1,
        },
      },
    ];

    // Executing the aggregation
    const users: IUser[] = await UserSchema.aggregate(aggregationPipeline);

    // Getting the total number of documents
    const totalDocuments = await UserSchema.countDocuments(searchCriteria);
    const totalPages = Math.ceil(totalDocuments / pageSize);

    // If there are no items found, return an empty array
    if (!users || users.length === 0) {
      const responseObj: BaseResponse = fromSuccess("No users found", {
        items: [],
        pageInfo: {
          page,
          pageSize,
          totalDocuments,
          totalPages,
        },
      });
      res.status(200).json(responseObj);
      return;
    }

    // Handle the response
    const responseObj: BaseResponse = fromSuccess(
      "Users retrieved successfully",
      {
        items: users,
        pageInfo: {
          page,
          pageSize,
          totalDocuments,
          totalPages,
        },
      }
    );
    res.status(200).json(responseObj);
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    const responseObj: BaseResponse = fromFailed(error.message);
    res.status(500).json(responseObj);
  }
};

/**
 * @Description  - Get a single user
 * @Route        - GET /api/users/:id
 * @Access       - Private
 * @Response     - Success response with user details or failure message
 * 
 * This controller retrieves the details of a specific user by their ID. 
 * If the user is found, the details (username, email, role) are returned. 
 * If the user does not exist, a failure response is sent back.
 */
export const getSingleUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.params.id;

    // Check for user already exist
    const user = await UserSchema.findById(userId);
    if (!user) {
      const responseObj: BaseResponse = fromFailed(
        "There is no user associated with this id"
      );
      res.status(400).json(responseObj);
      return;
    }

    const userDetails = {
      _id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const responseObj: BaseResponse = fromSuccess(
      "User retrieved successfully",
      userDetails
    );
    res.status(200).json(responseObj);
    return;
  } catch (error: any) {
    const responseObj: BaseResponse = fromFailed(error.message);
    res.status(500).json(responseObj);
    throw new Error(error);
  }
};

/**
 * @Description  - Delete a user
 * @Route        - DELETE /api/users/:id
 * @Access       - Private
 * @Response     - Success response confirming user deletion or failure message
 * 
 * This controller handles the deletion of a user by their ID. 
 * If the user exists, their account is deleted from the database. 
 * If no user is found with the provided ID, a failure message is returned. 
 * If an error occurs, an error message is sent back.
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId: string = req.params.id;

    // Check for user already exist
    const user = await UserSchema.findById(userId);
    if (!user) {
      const responseObj: BaseResponse = fromFailed(
        "There is no user associated with this id"
      );
      res.status(400).json(responseObj);
      return;
    }

    // Deleting the user data from the user schema
    await UserSchema.findByIdAndDelete(userId);

    const responseObj: BaseResponse = fromSuccess(
      "User account deleted successfully",
      null
    );
    res.status(200).json(responseObj);
    return;
  } catch (error: any) {
    const responseObj: BaseResponse = fromFailed(error.message);
    res.status(500).json(responseObj);
    throw new Error(error);
  }
};
