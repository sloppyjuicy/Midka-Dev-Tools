import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "--firebase": Boolean,
      "-g": "--git",
      "-f": "--firebase",
      "-i": "--install",
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
    firebase: args["--firebase"] || false,
  };
}

async function missingOptionsPrompt(options) {
  const defaultTemplate = "JavaScript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }
  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please specify template to use.",
      choices: ["JavaScript", "TypeScript", "ReactJS", "DiscordJs"],
      default: defaultTemplate,
    });
  }
  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Do you want to initialize Git repository?",
      default: false,
    });
  }
  if (!options.firebase) {
    questions.push({
      type: "confirm",
      name: "firebase",
      message: "Do you want to generate Firebase configuration?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    firebase: options.firebase || answers.firebase,
    targetDirectory: process.cwd(),
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await missingOptionsPrompt(options);
  await createProject(options);
}
