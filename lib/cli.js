"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cli = void 0;
const tslib_1 = require("tslib");
const arg_1 = tslib_1.__importDefault(require("arg"));
const Prompt_js_1 = tslib_1.__importDefault(require("./Prompt.js"));
const clear_1 = tslib_1.__importDefault(require("clear"));
const figlet_1 = tslib_1.__importDefault(require("figlet"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg_1.default({
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '-g': '--git',
        '-i': '--install',
        '-y': '--yes',
    }, {
        argv: rawArgs.slice(2),
    });
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
    };
}
async function missingOptionsPrompt(options) {
    const prompter = new Prompt_js_1.default();
    let answers = {
        template: null,
        name: '',
        pkgmanager: 'yarn',
        git: true,
        runInstall: true,
    };
    Object.assign(answers, await prompter.getName());
    if (!options.template) {
        Object.assign(answers, await prompter.getTemplate());
    }
    if (!options.git) {
        Object.assign(answers, await prompter.getGit());
    }
    if (!options.runInstall) {
        Object.assign(answers, await prompter.getInstall());
    }
    Object.assign(answers, await prompter.packageManager());
    if (answers.template !== 'typescript') {
        if (answers.template !== 'javascript') {
            Object.assign(answers, await prompter.language());
        }
    }
    if (answers.language === 'typescript' || answers.template === 'typescript') {
        Object.assign(answers, await prompter.setupTs());
    }
    if (answers.template === 'discordjs') {
        Object.assign(answers, await prompter.getCredentials());
    }
    return answers;
}
async function cli(args) {
    clear_1.default();
    console.log(chalk_1.default.red(figlet_1.default.textSync("Midka's tools", { horizontalLayout: 'full' })));
    let options = parseArgumentsIntoOptions(args);
    options = await missingOptionsPrompt(options);
    console.log(options);
}
exports.cli = cli;
