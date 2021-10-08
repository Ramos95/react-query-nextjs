import React, { FormEventHandler, useState } from "react";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { Person } from "src/lib/interfaces/Person";

const getPerson = async (): Promise<Person> => {
  try {
    const res = await fetch("/api/person");
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const createPerson = async (
  id: number,
  name: string,
  age: number
): Promise<Person> => {
  try {
    const res = await fetch("/api/person/create", {
      method: "POST",
      body: JSON.stringify({
        id,
        name,
        age,
      }),
    });
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

interface createPerson {
  id: number;
  name: string;
  age: number;
}

interface Context {
  previousPerson: Person | undefined;
}

const CreatePage = () => {
  const [enabled, setEnabled] = useState(true);
  const queryClient = useQueryClient();
  const { isLoading, data }: UseQueryResult<Person, Error> = useQuery<
    Person,
    Error
  >("person", getPerson, { enabled });
  const mutation: UseMutationResult<Person, Error, createPerson> = useMutation<
    Person,
    Error,
    createPerson,
    Context | undefined
  >("createPerson", async ({ id, name, age }) => createPerson(id, name, age), {
    //before mutation
    onMutate: async (variables: createPerson) => {
      //Cancel any outgoint refetches to aoid overwrite optimistic update
      await queryClient.cancelQueries("person");

      //snaphot the previou value
      const previousPerson: Person | undefined =
        queryClient.getQueryData("person");

      const newPerson: Person = {
        id: 123,
        name: "JOSEPH JO START",
        age: 200,
      };

      //optimistic update
      queryClient.setQueryData("person", newPerson);
      return { previousPerson };
    },
    //on sucess of mutation
    onSuccess: (
      data: Person,
      _variables: createPerson,
      _context: Context | undefined
    ) => {
      /*use query client to invalidate the person query
      so when the mutation is success*/
      //queryClient.invalidateQueries("person");
      //queryClient.setQueryData("person", data);
      return console.log("mutation data", data);
    },
    //if mutations errors
    onError: (
      error: Error,
      _variables: createPerson,
      context: Context | undefined
    ) => {
      console.log("error", error.message);
      queryClient.setQueryData("person", context?.previousPerson);
      return console.log(
        `rolling back optimistic update with id ${context?.previousPerson?.id}`
      );
    },
    //doesnt matter if query is error or sucess run this anymay
    onSettled: (
      _data: Person | undefined,
      _error: Error | null,
      _variables: createPerson | undefined,
      _context: Context | undefined
    ) => {
      //Always refetch after error or success
      queryClient.invalidateQueries("person");
      return console.log("complete mutation");
    },
  });

  const onSubmit: FormEventHandler<HTMLFormElement> = async (
    event: React.SyntheticEvent
  ) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      name: { value: string };
      age: { value: number };
    };
    const id = Math.random();
    const name = target.name.value;
    const age = target.age.value;
    mutation.mutate({ id, name, age });
  };

  /* if (mutation.isLoading) return <>loading...</>;
  if (mutation.isError) return <>error</>;
  if (mutation.isSuccess) return <>succes</>; */

  return (
    <>
      <button
        onClick={() => {
          setEnabled(!enabled);
          queryClient.invalidateQueries("person");
        }}
      >
        Invaldiate query
      </button>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" />
        <label htmlFor="name">Age:</label>
        <input type="number" id="age" />
        <input type="submit" value="Submit Person" />
      </form>
      {data && (
        <>
          <p>{data?.id}</p>
          <p>{data?.name}</p>
          <p>{data?.age}</p>
        </>
      )}
    </>
  );
};

export default CreatePage;
