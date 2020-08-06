import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDir, options.targetDirectory, {
    clobber: false,
  });
}

async function initGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(
      new Error("Jokin meni väärin Git repositoryn tekemisessä!")
    );
  }
  return;
}

async function initFirebase(options) {
  const result = await execa("firebase", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(
      new Error("Jokin meni väärin Firebase configuraation hankkimisessa!")
    );
  }
  return;
}
export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const templateDir = __dirname
    .toString()
    .replace(
      "src",
      "templates\\" + options.template.toLowerCase() + "-template"
    )
    .toString();

  options = {
    ...options,
    templateDir: templateDir,
  };
  try {
    await access(templateDir, fs.constants.R_OK).catch();
  } catch (error) {
    console.error(error);
    console.error("%s Jokin meni väärin.", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Kopioi mallin tiedostot",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Tee Git repository",
      task: () => initGit(options),
      enabled: (options) => options.git === true,
    },
    {
      title: "Tee Firebase configuraatio",
      task: () => initFirebase(options),
      enabled: (options) => options.firebase === true,
    },
    {
      title: "Asenna vaatimukset :)",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () =>
        !options.skipPrompts
          ? "Laita --yes jotta voit automaattisesti asentaa vaatimukset :)"
          : undefined,
    },
  ]);

  await tasks.run();

  console.log("%s Projekti valmiina", chalk.green.bold("VALMIS"));
  return true;
}
