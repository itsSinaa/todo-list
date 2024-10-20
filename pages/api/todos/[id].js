import { todoModel } from "@/model/Todo";
import { connectToDB } from "@/utils/connections";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return false;
  }

  await connectToDB();
  const { id } = req.query;

  const removedCourse = await todoModel.findByIdAndDelete({_id : id});

  console.log(removedCourse)
  if (!removedCourse) {
    return res.status(404).json({ msg: "todo not found" });
  }

  return res.status(200).json({ msg: "todo removed successfully !!" });
}
