mod config;
mod prompt;
use crate::config::get_main_config;
use crate::config::get_template_config;
use std::path::Path;
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
    let template_dir = clone_github_repo("https://github.com/kymppi/midka-dev-tools-templates.git");

    let main_config = get_main_config(&template_dir.path().to_string_lossy().to_string());

    println!("{:?}", main_config.templates);

    let templates = vec!["Blank", "NextJS"]; //TODO: read from file in a github repo
    let languages = vec!["Rust", "JavaScript", "TypeScript"]; //TODO: read from file in a github repo

    let template = prompt_select("Select a template", templates);
    let language = prompt_select("Select a language", languages);

    let init_git = prompt_confirm("Initialize git");

    println!("answers: {}:{}:{}", template, language, init_git);

    let blank_config = get_template_config(
        &(template_dir.path().to_string_lossy().to_string() + "/blank/config.toml"),
    );
    println!("blank_config: {:?}", blank_config);

    template_dir.close().unwrap();
}

fn clone_github_repo(repo: &str) -> TempDir {
    let dir = tempdir().unwrap();

    // run the git clone command
    //let status =
    Command::new("git")
        .arg("clone")
        .arg(repo)
        .arg(".")
        .current_dir(&dir)
        .output()
        .expect("Something went wrong with git clone");

    //println!("{:?}", status);

    dir
}
