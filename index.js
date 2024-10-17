import { port } from "./constants/dev.js";
import "./constants/dev.js";
import app from "./config/express.config.js";

app.listen(port, "0.0.0.0", (err) => {
  if (err) {
    console.log(err);
  }
  console.log("I'm online at http://localhost:" + port);
});
