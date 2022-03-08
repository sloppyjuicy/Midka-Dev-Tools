mod prompt;
use std::process::Command;

use tempfile::tempdir;
use tempfile::TempDir;

use crate::prompt::prompt_confirm;
use crate::prompt::prompt_select;

/*
    Config file in template directory
    - name: Blank
    - description: A template for a rust project
    - language: [rust, typescript, javascript]

    if multiple languages are specified, the template per language should be under folder named after language
    templates github repository:
        Blank/
            config.toml
            rust/
                config.toml -> command: [cargo new]
            typescript/
                files here
            javascript/
                files here
        NextJS/
            config.toml
            javascript/
                files here
            typescript/
                config.toml -> command: [npx create-next-app --typescript]

*/

pub fn run() {
    let templates = clone_github_repo("https://github.com/kymppi/midka-dev-tools-templates.git");
    println!("templates: {:?}", templates);

    let templates = vec!["Blank", "NextJS"]; //TODO: read from file in a github repo
    let languages = vec!["Rust", "JavaScript", "TypeScript"]; //TODO: read from file in a github repo

    let template = prompt_select("Select a template", templates);
    let language = prompt_select("Select a language", languages);

    let init_git = prompt_confirm("Initialize git");

    println!("answers: {}:{}:{}", template, language, init_git);
}

fn clone_github_repo(repo: &str) -> TempDir {
    let dir = tempdir().unwrap();

    // run the git clone command
    Command::new("git")
        .arg("clone")
        .arg(repo)
        .arg(".")
        .current_dir(&dir)
        .output()
        .expect("*Unpacking objects*");

    dir
}
