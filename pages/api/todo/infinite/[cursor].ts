import { NextApiRequest, NextApiResponse } from "next";
import { InfinitePage } from "src/lib/interfaces/InfinitePage";
import { Todo } from "src/lib/interfaces/Todo";

const getInfinitePage = (
  request: NextApiRequest,
  response: NextApiResponse<InfinitePage | Error>
): void => {
  const {
    query: { cursor },
  } = request;
  const returnTodos: Todo[] = [];
  const numCursor = +cursor;
  const nums = numCursor * 5;

  for (let i = nums; i < nums + 5; i++) {
    returnTodos.push({
      id: i,
      message: `Todo number ${i}`,
    });
  }

  const testPage: InfinitePage = {
    nextCursor: numCursor + 1 < 4 ? numCursor + 1 : undefined,
    page: {
      todos: returnTodos,
      hasMore: cursor !== "4",
    },
  };
  response.status(200).json(testPage);
};

export default getInfinitePage;
