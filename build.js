const fs = require("fs-extra");
const path = require("path");

const buildPath = path.join(__dirname, "build");

if (fs.existsSync(buildPath)) fs.removeSync(buildPath);

const publicDirPath = path.join(__dirname, "src", "public");
const viewsDirPath = path.join(__dirname, "src", "views");

fs.copySync(publicDirPath, path.join(__dirname, "build", "public"));
fs.copySync(viewsDirPath, path.join(__dirname, "build", "views"));
