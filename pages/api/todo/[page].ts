import { NextApiRequest, NextApiResponse } from "next";
import { PaginatedTodo } from "src/lib/interfaces/Paginated";
import { Todo } from "src/lib/interfaces/Todo";

const getTodoPaginated = (
  request: NextApiRequest,
  response: NextApiResponse<PaginatedTodo>
): void => {
  const {
    query: { page },
  } = request;

  const returnTodos: Todo[] = [];

  const nums = +page * 5;

  for (let i = nums; i < nums + 5; i++) {
    returnTodos.push({
      id: i,
      message: `Todo number ${i}`,
    });
  }

  response.status(200).json({ todos: returnTodos, hasMore: page !== "4" });
};

export default getTodoPaginated;
