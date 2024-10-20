import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return false;
  } else {
    try {
      res
        .setHeader(
          "Set-Cookie",
          serialize("token", "", {
            path: "/",
            maxAge: 0,
          })
        )
        .status(200)
        .json({ msg: "user logged out sucessfully !!" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "UnKnown Internal Server Erorr !!", err: error });
    }
  }
}
