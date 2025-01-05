const NodeRSA = require("node-rsa");
require("dotenv").config();

exports.decrypt = (data) => {
  const key = new NodeRSA({ b: 512 });
  key.importKey(process.env.RSA_PRIVATE, "private");

  return key.decrypt(data, "utf8");
};
