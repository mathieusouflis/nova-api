import { port } from "./constants/dev.js";
import "./constants/dev.js";
import app from "./config/express.config.js";
import https from "https";

const credentials = {
  key: process.env.SERVER_KEY,
  cert: process.env.SERVER_CERT,
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`App started : http://localhost:${port}/api`);
});
