import { port } from "./constants/dev.js";
import "./constants/dev.js";
import fs from "fs";
import app from "./config/express.config.js";
import https from "https";
import constants from "constants";

const credentials = {
  key: fs.readFileSync("server.key", "utf8"),
  cert: fs.readFileSync("server.cert", "utf8"),
  secureOptions:
    constants.SSL_OP_NO_SSLv3 |
    constants.SSL_OP_NO_TLSv1 |
    constants.SSL_OP_NO_TLSv1_1,
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`App started : http://localhost:${port}/api`);
});
