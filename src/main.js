import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDir, options.targetDirectory, {
        clobber: false,
    });
};

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    }

    
    const templateDir = __dirname.toString()
    .replace('src', 'templates\\' + options.template
    .toLowerCase() + '-template')
    .toString()
    
    options = {
        ...options,
        templateDir: templateDir
    }
    try {
        await access(templateDir, fs.constants.R_OK).catch();
    } catch (error) {
        console.error(error)
        console.error('%s Jokin meni väärin.', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    console.log('Kopioidaan tiedostoja');
    await copyTemplateFiles(options);

    console.log('%s Projekti valmiina', chalk.green.bold('VALMIS'))
    return true;
}