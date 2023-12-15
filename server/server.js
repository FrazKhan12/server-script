const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const yargs = require("yargs");
const { execSync } = require("child_process");

const options = yargs
  .usage("Usage : $0 <command>")
  .command("auth-make", "create authentication structure").argv;

const corePath = path.join(__dirname, "core");

const structure = {
  controllers: [
    {
      name: "authcontroller.js",
      content: fs.readFileSync(
        path.join(corePath, "userController.js"),
        "utf8"
      ),
    },
  ],
  models: [
    {
      name: "usermodel.js",
      content: fs.readFileSync(path.join(corePath, "userModal.js"), "utf8"),
    },
  ],
  routes: [
    {
      name: "userroute.js",
      content: fs.readFileSync(path.join(corePath, "userRoute.js"), "utf8"),
    },
  ],
};

const authStructure = () => {
  Object.entries(structure).forEach(([folder, files]) => {
    const folderPath = path.join(__dirname, folder);
    mkdirp.sync(folderPath);

    files.forEach((file) => {
      const filePath = path.join(folderPath, file.name);

      fs.writeFile(filePath, file.content, (error) => {
        if (error) {
          console.log(`error creating ${file.name} file:`, error);
          return;
        }
        console.log(`created ${file.name} inside ${folder}`);
      });
    });
  });
  console.log("Structure Created Succesfully");

  installDependencies();
};

const installDependencies = () => {
  try {
    console.log("installing dependencies");
    const dependencies = ["express", "mongoose", "nodemon"];
    dependencies.forEach((dependency) => [
      execSync(`npm install ${dependency}`),
    ]);
    console.log("dependencies install successfully");
  } catch (error) {
    console.log(error);
  }
};

if (options._.includes("auth-make")) {
  authStructure();
} else {
  console.log("Invalid Command");
}
