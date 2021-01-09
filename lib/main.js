"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const ncp_1 = tslib_1.__importDefault(require("ncp"));
const util_1 = require("util");
const execa_1 = tslib_1.__importDefault(require("execa"));
const listr_1 = tslib_1.__importDefault(require("listr"));
const pkg_install_1 = require("pkg-install");
const access = util_1.promisify(fs_1.default.access);
const copy = util_1.promisify(ncp_1.default);
async function copyTemplateFiles(options) {
    return copy(options.templateDir, options.targetDirectory, {
        clobber: false,
    });
}
async function initGit(options) {
    const result = await execa_1.default('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Something went wrong when creating Git repository!'));
    }
    return;
}
async function createConfig(options) {
    let config = {
        token: options.token,
        prefix: options.prefix,
        ownerId: options.ownerId,
    };
    let data = JSON.stringify(config, null, 2);
    fs_1.default.writeFileSync('config.json', data);
}
async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };
    const templateDir = __dirname
        .toString()
        .replace('lib', 'templates\\' + options.template.toLowerCase() + '-template')
        .toString();
    options = {
        ...options,
        templateDir,
    };
    try {
        await access(templateDir, fs_1.default.constants.R_OK).catch();
    }
    catch (error) {
        console.error(error);
        console.error('%s Something went wrong!', chalk_1.default.red.bold('ERROR'));
        process.exit(1);
    }
    const tasks = new listr_1.default([
        {
            title: 'Copy template files',
            task: () => copyTemplateFiles(options),
        },
        {
            title: 'Make Git repository',
            task: () => initGit(options),
            enabled: () => options.git === true,
        },
        {
            title: 'Generate bot configuration',
            task: () => createConfig(options),
            enabled: () => options.template === 'discordjs',
        },
        {
            title: 'Install Dependencies',
            task: () => pkg_install_1.projectInstall({
                prefer: options.pkgmanager,
            }),
            skip: () => !options.runInstall
                ? 'Put -i to the command to automatically install dependencies :)'
                : undefined,
        },
    ]);
    await tasks.run();
    console.log('%s Project Ready', chalk_1.default.green.bold('READY'));
    return true;
}
exports.createProject = createProject;
