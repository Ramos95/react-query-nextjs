import { NextApiRequest, NextApiResponse } from "next";
import { Person } from "src/lib/interfaces/Person";

const getPerson = (
  request: NextApiRequest,
  response: NextApiResponse<Person>
): void => {
  response.status(200).json({ id: Math.random(), name: "JUAN", age: 100 });
};

export default getPerson;
