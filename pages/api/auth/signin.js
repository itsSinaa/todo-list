import { userModel } from "@/model/user";
import { generateCookie, verifyPassword } from "@/utils/auth";
import { connectToDB } from "@/utils/connections";
import { serialize } from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return false;
  } else {
    try {
      await connectToDB();
      const { identifier, password, rememeberMe } = req.body;

      if (!identifier.trim() || !password.trim()) {
        return res.status(422).json({ msg: "data is not valid" });
      }

      const user = await userModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return res.status(404).json({ msg: "user not found" });
      }

      const verifiedPassword = await verifyPassword(password, user.password);

      if (!verifiedPassword) {
        return res
          .status(404)
          .json({ msg: "username or password is incorrect !!!" });
      }

      if (rememeberMe) {
        const token = generateCookie({ email: user.email });

        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24,
          })
        );
      } else {
        const token = generateCookie({ email: user.email });

        res.setHeader(
          "Set-Cookie",
          serialize("token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60,
          })
        );
      }

      return res.status(200).json({ msg: "user logged in successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "UnKnown Internal Server Erorr !!" });
    }
  }
}
