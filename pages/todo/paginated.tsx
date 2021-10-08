import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { PaginatedTodo } from "src/lib/interfaces/Paginated";

const PaginatedTodoPage = () => {
  const [page, setPage] = useState(0);

  const fetchTodos = (pageNumber = 0) =>
    fetch(`/api/todo/${pageNumber}`).then((res) => res.json());

  const queryClient = useQueryClient();

  const { isLoading, data, isFetching, isPreviousData } = useQuery<
    PaginatedTodo,
    Error
  >(["todos", page], () => fetchTodos(page), { keepPreviousData: true });

  /*prefecth the next two pages on every load*/
  useEffect(() => {
    if (data?.hasMore) {
      queryClient.prefetchQuery(["todos", page + 1], () =>
        fetchTodos(page + 1)
      );
      queryClient.prefetchQuery(["todos", page + 2], () =>
        fetchTodos(page + 2)
      );
    }
  }, [data, page, queryClient]);

  if (isLoading) return <>Loading...</>;

  return (
    <>
      {data?.todos.map((todo) => (
        <p key={todo.id}>{todo.message}</p>
      ))}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 0))}
        disabled={!page}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          if (!isPreviousData && data?.hasMore) {
            setPage((oldPage) => oldPage + 1);
          }
        }}
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching && <span>loading...</span>}
    </>
  );
};

export default PaginatedTodoPage;
