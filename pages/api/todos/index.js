import { todoModel } from "@/model/Todo";
import { connectToDB } from "@/utils/connections";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  if (req.method === "GET") {
    await connectToDB();

    const todos = await todoModel.find({});
    return res.status(200).json(todos);
  } else if (req.method === "POST") {
    try {
      await connectToDB();

      const { title, userID } = req.body;

      if (!title.trim() || !isValidObjectId(userID)) {
        return res.status(422).json({ msg: "invalid data" });
      }

      const todo = await todoModel.create({
        title,
        userID,
      });

      console.log(todo);

      return res.status(201).json({ msg: "todo created successfully!!" });
    } catch (error) {
      console.log(error);
    }
  } else {
    return false;
  }
}
