import bcrypt from "bcrypt";

const pcrypt = async (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
};

export default pcrypt;
