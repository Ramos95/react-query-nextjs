import { QueryFunctionContext, useInfiniteQuery } from "react-query";
import { InfinitePage } from "src/lib/interfaces/InfinitePage";

const fetchTodos = ({ pageParam = 0 }: QueryFunctionContext) =>
  fetch(`/api/todo/infinite/${pageParam}`).then((res) => res.json());

const InfiniteTodoPage = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<InfinitePage, Error>("infinite", fetchTodos, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  return (
    <>
      {data?.pages.map((infinitePage, index) => (
        <div key={index}>
          {infinitePage.page.todos.map((todo) => (
            <p key={todo.id}>{todo.message}</p>
          ))}
        </div>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more"
          : hasNextPage
          ? "Load More ?"
          : "Nothing more to load"}
      </button>
    </>
  );
};

export default InfiniteTodoPage;
