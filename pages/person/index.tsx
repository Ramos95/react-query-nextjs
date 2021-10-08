import { useState } from "react";
import {
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { Person } from "src/lib/interfaces/Person";
import { Todo } from "src/lib/interfaces/Todo";

const getPerson = async (): Promise<Person> => {
  try {
    const res = await fetch("/api/person");
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const getTodo = async (): Promise<Todo> => {
  try {
    const res = await fetch("/api/todo");
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const PersonPage = () => {
  const [enabled, setEnabled] = useState(true);
  const queryClient = useQueryClient();
  /*person query*/
  const {
    isLoading,
    error,
    isSuccess: personSuccess,
    data,
  }: UseQueryResult<Person, Error> = useQuery<Person, Error>(
    "person",
    getPerson,
    { enabled }
  );

  /*todo query*/
  const { isSuccess: todoSucces, data: todoData }: UseQueryResult<Todo, Error> =
    useQuery<Todo, Error>("to_do", getTodo, { enabled });

  /*dynamic parallel queries*/
  const uerQueires = useQueries(
    ["1", "2", "3"].map((id) => {
      return {
        /*key can also hold objects like ["to_do",{id}]*/
        queryKey: ["to_do", id],
        queryFn: () => {
          return id;
        },
        enabled,
      };
    })
  );

  if (personSuccess && todoSucces && enabled) {
    setEnabled(false);
  }

  if (isLoading) return <>loading...</>;
  if (error) return <>error</>;

  return (
    <>
      <button
        onClick={() => {
          /*this will invalidate all queries*/
          queryClient.invalidateQueries();
        }}
      >
        Invalidate queries
      </button>
      <button
        onClick={() => {
          /*this will invalidate all queries in which the query key starts with person*/
          queryClient.invalidateQueries("person");
        }}
      >
        Invalidate Person queries
      </button>
      <button
        onClick={() => {
          /*this will invalidate all queries in which the query key starts with to_do*/
          queryClient.invalidateQueries("to_do");
        }}
      >
        Invalidate To do queries
      </button>

      <button
        onClick={() => {
          /*this will invalidate only the query with the specified key*/
          queryClient.invalidateQueries(["to_do", "1"], { exact: true });
        }}
      >
        Invalidate Specific Query
      </button>

      <button
        onClick={() => {
          /*this will invalidate only the query with the specified key*/
          /*if the use object it will be query.queryKey[1].id*/
          queryClient.invalidateQueries({
            predicate: (query) => +(query.queryKey[1] as string) % 2 === 1,
          });
        }}
      >
        Invalidate with predicate
      </button>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
};

export default PersonPage;
