import { port } from "./constants/dev.js";
import "./constants/dev.js";
import app from "./config/express.config.js";

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`App started : http://localhost:${port}/api`);
});
