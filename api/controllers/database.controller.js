const fs = require("fs");

exports.read = (database) => {
  return JSON.parse(
    fs.readFileSync(`databases/${database}.json`, { encoding: "utf-8" }),
  );
};

exports.write = async (database, data) => {
  return fs.writeFileSync(
    `databases/${database}.json`,
    JSON.stringify(data, null, 2),
  );
};
