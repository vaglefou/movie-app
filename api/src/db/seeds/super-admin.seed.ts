import UserSchema from "../../models/user.model";
import UserRoleSchema from "../../models/user-role.model";
import UserRoles from "../../constants/user-roles";
import { hashPassword } from "../../common/utils/bycrypt.utils";

export const seedSuperAdminUser = async () => {
  // Check the user already exist
  const existingUsers = await UserSchema.find({});
  if (existingUsers.length > 0) {
    console.log("Users already exist in the database.");
    return;
  }

  // Check the user role already exist
  const userRole = await UserRoleSchema.findOne({
    name: UserRoles?.ADMIN,
  });
  if (!userRole) {
    console.log("User role doesn't exist. Please check the user role again.");
    return;
  }

  // Array of user roles
  const superAdminUser = {
    username: "Admin",
    email: "admin@movieapp.com",
    password: await hashPassword("Password@123"),
    role: userRole?.name,
  };

  const createdAdminUser = await UserSchema.create(superAdminUser);
  console.log("Database seeded with SuperAdmin user :", createdAdminUser);
};
