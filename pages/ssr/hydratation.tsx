import { GetServerSideProps } from "next";
import {
  dehydrate,
  DehydratedState,
  QueryClient,
  useQuery,
  UseQueryResult,
} from "react-query";
import { Person } from "src/lib/interfaces/Person";

interface InitalDataExamplePageProps {
  person: Person;
}

const getPerson = async (): Promise<Person> => {
  try {
    const res = await fetch("http://localhost:3000/api/person");
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const HydratedPage = () => {
  const { isLoading, isError, error, data }: UseQueryResult<Person, Error> =
    useQuery<Person, Error>("person", getPerson);

  if (isLoading) return <>loading...</>;
  if (isError) return <>error</>;

  return (
    <>
      <h1>Person</h1>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: { dehytratedState: DehydratedState };
}> => {
  /*pre fetch the date and set the resul as the inital query data and will affect all query with the specified key*/
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("person", getPerson);
  return { props: { dehytratedState: dehydrate(queryClient) } };
};

export default HydratedPage;
