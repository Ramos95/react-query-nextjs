import { GetServerSideProps } from "next";
import { useQuery, UseQueryResult } from "react-query";
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

const InitialDataExamplePage = ({ person }: InitalDataExamplePageProps) => {
  const { isLoading, isError, error, data }: UseQueryResult<Person, Error> =
    useQuery<Person, Error>("person", getPerson, { initialData: person });

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
  props: { person: Person };
}> => {
  const person = await getPerson();
  return { props: { person } };
};

export default InitialDataExamplePage;
