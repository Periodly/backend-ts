import { authorizeUser } from "./user";

const getMoods = async (token: string) => {
  const username = (await authorizeUser(token)).username;
  // get table named after user and return everything
  
};
