import express from "express";
import route from "./routes/mainRoute";
import dotenv from "dotenv";
import config from "./config/default";

dotenv.config();
const app = express();
app.use("/", route);

const { port } = config;
app.listen(port, () => console.log(`Server is running on port: ${port}...`));
export default app;
