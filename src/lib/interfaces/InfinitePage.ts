import { Todo } from "./Todo";

export interface InfinitePage {
  nextCursor: number | undefined;
  page: {
    todos: Todo[];
    hasMore: boolean;
  };
}
