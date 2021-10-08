import { NextApiRequest, NextApiResponse } from "next";
import { Person } from "src/lib/interfaces/Person";

const createPerson = (request: NextApiRequest, response: NextApiResponse) => {
  const data: Person = JSON.parse(request.body);
  response.status(200).json(data);
};

export default createPerson;
