#![feature(let_else)]

mod config;
mod prompt;
mod utils;

use std::collections::HashMap;

use clap::Parser;
use colored::Colorize;

use crate::{
    config::{get_main_config, get_template_config},
    prompt::{prompt_confirm, prompt_select},
    utils::{clone_github_repo, run_command},
};

#[derive(Parser, Debug)]
struct CLI {
    #[clap(parse(from_os_str), default_value = ".")]
    path: std::path::PathBuf,
}

fn main() {
    let interactive = true;
    let args = CLI::parse();

    println!("{:?}", args);

    if interactive {
        run_interactive(args);
    } else {
        //run_noninteractive();
    }
}

fn run_interactive(args: CLI) {
    // Create temp directory
    let template_dir = clone_github_repo("https://github.com/kymppi/midka-dev-tools-templates.git");

    //TODO check if the args.path directory is empty or create it if it doesn't exist

    // Get main config
    let main_config = get_main_config(&template_dir.path().to_string_lossy().to_string()).unwrap();

    // Get data for questions
    let templates = main_config.templates;
    let template = prompt_select("Select a template", templates);
    let template_config = get_template_config(
        &template_dir
            .path()
            .join(&template.to_lowercase())
            .join("config.toml")
            .to_str()
            .unwrap(),
    );

    let Ok(config) = template_config else {
        return println!("{}", "Error: invalid template".red());
    };

    let language = prompt_select("Select a language", config.language);

    // Questions that are always asked
    let init_git = prompt_confirm("Initialize git");

    // Run commands based on answers
    if init_git {
        println!("{}", "Initializing git...".cyan());
        let result = run_command("git init", Some(args.path.clone()));

        match result {
            Ok(_) => println!("{}", "Git initialized".green()),
            Err(e) => println!("{}", e.to_string().red()),
        }
    }

    //TODO Copy files

    // Running init & install commands
    println!("{}", "Starting project initialization...".cyan());

    let mut status: HashMap<String, bool> = HashMap::new();

    let command = config.init_commands[&language.to_lowercase()]
        .as_str()
        .unwrap_or("");

    let init_result = run_command(&command, Some(args.path.clone()));
    let install_result = run_command(
        &config.install_commands[&language.to_lowercase()]
            .as_str()
            .unwrap_or(""),
        Some(args.path.clone()),
    );

    match init_result {
        Ok(_) => status.insert("init".to_string(), true),
        Err(e) => {
            println!("{}", e.to_string().red());
            status.insert("init".to_string(), false);
            return;
        }
    };

    match install_result {
        Ok(_) => status.insert("install".to_string(), true),
        Err(e) => {
            println!("{}", e.to_string().red());
            status.insert("install".to_string(), false);
            return;
        }
    };

    // Remove temp dir
    template_dir.close().unwrap();
}
