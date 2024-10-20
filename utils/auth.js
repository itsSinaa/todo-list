import { compare, hashSync } from "bcrypt";
import { verify, sign } from "jsonwebtoken";

const verifyPassword = async (password, hashedPassword) => {
  const verifiedPassword = await compare(password, hashedPassword);
  return verifiedPassword;
};

const verifyToken = (token) => {
  try {
    const verifiedToken = verify(token, process.env.API_KEY);
    return verifiedToken;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const hashPassword = async (password) => {
  const hashedPassword = await hashSync(password, 12);
  return hashedPassword;
};

const generateCookie = (data) => {
  const userToken = sign({ ...data }, process.env.API_KEY, {
    expiresIn: "24h",
  });

  return userToken;
};

export { hashPassword, generateCookie, verifyToken, verifyPassword };
