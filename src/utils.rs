use std::process::Command;

use colored::Colorize;
use tempfile::tempdir;
use tempfile::TempDir;

pub fn clone_github_repo(repo: &str) -> TempDir {
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

pub fn run_command(command: &str, path: Option<std::path::PathBuf>) -> Result<(), anyhow::Error> {
    let path = path.unwrap_or(".".into());

    let result = Command::new("sh")
        .arg("-c")
        .arg(command)
        .current_dir(path)
        .output();

    if result.is_err() {
        return Err(anyhow::anyhow!(
            "{} {}",
            "Error running command:".red(),
            command
        ));
    }

    println!("{} {}", "Command executed successfully:".green(), command);

    Ok(())
}
