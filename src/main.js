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
      new Error("Something went wrong when creating Git repository!")
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
      new Error("Something went wrong when generating Firebase configuration!")
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
    console.error("%s Something went wrong!", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: "Copy template files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Make Git repository",
      task: () => initGit(options),
      enabled: () => options.git === true,
    },
    {
      title: "Generate Firebase configuration",
      task: () => initFirebase(options),
      enabled: () => options.firebase === true,
    },
    {
      title: "Install Dependencies :)",
      task: () =>
        projectInstall({
          prefer: "npm",
        }),
      skip: () =>
        !options.runInstall
          ? "Put --install to the command to automatically install dependencies :)"
          : undefined,
    },
  ]);

  await tasks.run();

  console.log("%s Project Ready", chalk.green.bold("READY"));
  return true;
}
