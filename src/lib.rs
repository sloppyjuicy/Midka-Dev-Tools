use dialoguer::{console::Term, theme::ColorfulTheme, Confirm, Select};

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
    let templates = vec!["Blank", "NextJS"]; //TODO: read from file in a github repo
    let languages = vec!["Rust", "JavaScript", "TypeScript"]; //TODO: read from file in a github repo

    let template = prompt_select("Select a template", templates);
    let language = prompt_select("Select a language", languages);

    let init_git = prompt_confirm("Initialize git");

    print!("{}:{}:{}", template, language, init_git);
}

fn prompt_confirm(question: &str) -> bool {
    let selection = Confirm::with_theme(&ColorfulTheme::default())
        .with_prompt(question)
        .interact_on_opt(&Term::stderr());

    match selection {
        Ok(selection) => return handle_select_bool(selection),
        Err(err) => {
            println!("Error: could not get selection, err: {}", err);
            false
        }
    };

    false
}

fn prompt_select<'a>(question: &'a str, options: Vec<&'a str>) -> &'a str {
    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt(question)
        .items(&options)
        .default(0)
        .interact_on_opt(&Term::stderr());

    match selection {
        Ok(item) => handle_select(item, options),
        Err(error) => {
            println!("Error: {}", error);
            "Error"
        }
    }
}

fn handle_select<'a>(selection: Option<usize>, items: Vec<&'a str>) -> &'a str {
    match selection {
        Some(index) => items[index],
        None => "Selection cancelled",
    }
}

fn handle_select_bool(selection: Option<bool>) -> bool {
    match selection {
        Some(index) => index,
        None => {
            "Selection cancelled";
            false
        }
    }
}
