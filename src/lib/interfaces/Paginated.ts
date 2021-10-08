import { Todo } from "./Todo";

export interface PaginatedTodo {
  todos: Todo[];
  hasMore: boolean;
}
