import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Person } from "src/lib/interfaces/Person";

const getPersonByID = async (id: string): Promise<Person> => {
  try {
    const res = await fetch(`/api/person/${id}`);
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const PersonByIDPage = () => {
  const {
    query: { id },
  } = useRouter();

  const { isLoading, error, data } = useQuery<Person, Error>(
    ["person", id],
    () => getPersonByID(id as string),
    { enabled: !!id } //wait for id to run
  );

  if (isLoading) return <>loading...</>;
  if (error) return <>error</>;
  return (
    <>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
      <p>{data?.age}</p>
    </>
  );
};

/* export const getStaticPaths: GetStaticPaths = async ()=>{
  const paths =[{params:{id:"1"}}]
  return {paths,fallback:false}
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = String(params?.id);
  return {
    props: { id },
  };
}; */

export default PersonByIDPage;
