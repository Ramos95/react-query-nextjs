import { NextApiRequest, NextApiHandler, NextApiResponse } from "next";
import { Person } from "src/lib/interfaces/Person";

const getUserById = (
  request: NextApiRequest,
  response: NextApiResponse<Person>
) => {
  const {
    query: { id },
  } = request;
  response.status(200).json({ id: +id, name: "JOJORGE", age: 12 });
};

export default getUserById;
