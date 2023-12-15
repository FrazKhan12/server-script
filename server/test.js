const fs = require("fs");
const path = require("path");
fs.readFile("./core/userController.js", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
