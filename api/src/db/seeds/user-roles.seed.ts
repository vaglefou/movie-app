import UserRoleSchema from "../../models/user-role.model";
import UserRoles from "../../constants/user-roles";

export const seedUserRoles = async () => {
  // Array of user roles
  const roles = [
    {
      name: UserRoles.ADMIN,
    },
    {
      name: UserRoles.USER,
    }
  ];

  // Check if user roles already exist in the database
  const existingUserRoles = await UserRoleSchema.find({});
  if (existingUserRoles.length > 0) {
    console.log("User roles already exist in the database. No need to seed.");
    return;
  }

  // Create user roles in the database
  const createdDocuments = [];

  for (const role of roles) {
    const createdDocument = await UserRoleSchema.create({
      name: role.name,
    });

    createdDocuments.push(createdDocument);
  }
  console.log("Database seeded with user roles :", createdDocuments);
};
