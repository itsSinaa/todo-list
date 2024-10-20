import { userModel } from "@/model/user";
import { generateCookie, hashPassword } from "@/utils/auth";
import { connectToDB } from "@/utils/connections";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return false;
  } else {
    await connectToDB();
    try {
      const { firstname, lastname, username, email, password } = req.body;

      if (
        !firstname.trim() ||
        !lastname.trim() ||
        !username.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        return res.status(422).json({ msg: "data is not valid" });
      }

      const previousUser = await userModel.findOne({
        $or: [{ username }, { email }],
      });

      if (previousUser) {
        return res
          .status(409)
          .json({ msg: "username or email already exist !!" });
      }

      const hashedPassword = await hashPassword(password);

      const token = generateCookie({email});

      const users = await userModel.find({});

      await userModel.create({
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        role: users.length > 0 ? "USER" : "ADMIN",
      });

        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
          })
        );

      res.status(201).json({ msg: "user registered successfully !!" });
    } catch (error) {
      res.json({ msg: error });
    }
  }
}
