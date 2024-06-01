import { createServer } from "node:http";
import "./app/helpers/env.load";
import app from "./app/index.app";

const server = createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server launched at http://localhost:${PORT}`);
});
