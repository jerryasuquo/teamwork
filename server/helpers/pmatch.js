import bcrypt from "bcrypt";

const pmatch = (pwd, hash) => bcrypt.compareSync(pwd, hash);

export default pmatch;
