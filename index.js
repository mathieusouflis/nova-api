const { port } = require("./constants/dev");
const app = require("./config/express.config");

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`App started : http://localhost:${port}/api`);
});
