const fs = require("fs");
const path = require("path");

const getModelFiles = (dir) =>
  fs
    .readdirSync(dir)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== "collector.js" &&
        file !== "routes.js"
    )
    .map((file) => path.join(dir, file));

const files = getModelFiles(__dirname);

const routes = files.map((route) => {
  return require(route + "/route.js");
});

module.exports = routes;
