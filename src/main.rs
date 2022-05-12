#![feature(let_else)]

mod config;
mod prompt;
mod utils;

use std::{collections::HashMap, fs::create_dir, path::PathBuf};

use clap::Parser;
use colored::Colorize;

use crate::{
    config::{get_main_config, get_template_config},
    prompt::{prompt_confirm, prompt_select, prompt_input},
    utils::{clone_github_repo, copy_dir_all, run_command, run_commands_from_config},
};

#[derive(Parser, Debug)]
struct Cli {
    #[clap(parse(from_os_str), default_value = ".")]
    path: std::path::PathBuf,
}

fn main() {
    let interactive = true;
    let args = Cli::parse();

    if interactive {
        run_interactive(args);
    } else {
        //run_noninteractive();
    }
}

fn run_interactive(args: Cli) {
    // Create temp directory
    let template_dir = clone_github_repo("https://github.com/kymppi/midka-dev-tools-templates.git");

    //Check if path is directory and it exists
    let path_exists = args.path.is_dir();

    if !path_exists {
        let result = create_dir(&args.path);

        match result {
            Ok(_) => {
                println!("{} {}", "Directory created: ".green(), args.path.display());
            }
            Err(e) => {
                println!("{}", e.to_string().red());
            }
        }
    }

    // Check that directory is empty
    let is_empty = PathBuf::from(&args.path)
        .read_dir()
        .map(|mut i| i.next().is_none())
        .unwrap_or(false);

    if !is_empty {
        println!(
            "{} {} {}",
            "Directory".red(),
            args.path.display(),
            "is not empty.".red()
        );
        return;
    }

    // Get main config
    let main_config = get_main_config(&template_dir.path().to_string_lossy().to_string()).unwrap();

    // Get data for questions
    let templates = main_config.templates;
    let template = prompt_select("Select a template", templates);
    let template_config = get_template_config(
        template_dir
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
    
    let mut arg_map: HashMap<String, String> = HashMap::new();

    if config.args.is_some() {
        let args = config.args.unwrap();
        for arg in args {
            let id: &str = match arg.get("id") {
                None => "Error",
                Some(x) => x.as_str().unwrap(),
            };
            let name: &str = match arg.get("name") {
                None => "Error",
                Some(x) => x.as_str().unwrap(),
            };
            let example: &str = match arg.get("example") {
                None => "Error",
                Some(x) => x.as_str().unwrap(),
            };
            
            let question = format!("{name} (example: {example})");
            arg_map.insert(
                id.to_string(),
                prompt_input(&question)
            );
        }

    }

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

    //Copy files
    let source = template_dir
        .path()
        .join(&template.to_lowercase())
        .join(&language.to_lowercase());
    let result = copy_dir_all(&source, &args.path);

    match result {
        Ok(_) => println!("{}", "Files copied".green()),
        Err(e) => println!("{}", e.to_string().red()),
    }

    // Running init & install commands
    println!("{}", "Starting project initialization...".cyan());

    let mut status: HashMap<String, bool> = HashMap::new();
    
    // Run init commands
    run_commands_from_config(
        &config.init_commands,
        "init",
        &language,
        &args.path,
        &mut status,
        arg_map.clone()
    );

    // Run install commands
    run_commands_from_config(
        &config.install_commands,
        "install",
        &language,
        &args.path,
        &mut status,
        arg_map.clone()
    );

    if *status.get("init").unwrap() {
        println!("{}", "Init command was successful".green());
    } else {
        println!("{}", "Init command failed".red());
    }

    if *status.get("install").unwrap() {
        println!("{}", "Install command was successful".green());
    } else {
        println!("{}", "Install command failed".red());
    };

    // Remove temp dir
    template_dir.close().unwrap();
}
