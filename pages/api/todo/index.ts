import { NextApiRequest, NextApiResponse } from "next";
import { Todo } from "src/lib/interfaces/Todo";

const getTodo = (
  request: NextApiRequest,
  response: NextApiResponse<Todo>
): void => {
  response.status(200).json({ id: 1, message: "TODO MA BOY" });
};

export default getTodo;
