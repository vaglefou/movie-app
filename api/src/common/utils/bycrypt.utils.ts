import bcrypt from "bcryptjs";

// Hashing a new password
const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Comparing new and current password
const comparePassword = async (
  passwordFromReqBody: string,
  passwordFromDb: string
) => {
  return await bcrypt.compare(passwordFromReqBody, passwordFromDb);
};

export { hashPassword, comparePassword };
