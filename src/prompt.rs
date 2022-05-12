use dialoguer::{console::Term, theme::ColorfulTheme, Confirm, Select, Input};

pub fn prompt_confirm(question: &str) -> bool {
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

pub fn prompt_select(question: &str, options: Vec<String>) -> String {
    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt(question)
        .items(&options)
        .default(0)
        .interact_on_opt(&Term::stderr());

    match selection {
        Ok(item) => handle_select(item, options),
        Err(error) => {
            println!("Error: {}", error);
            "Error".to_string()
        }
    }
}

pub fn prompt_input(question: &str) -> String {
    let selection = Input::<String>::with_theme(&ColorfulTheme::default())
        .with_prompt(question)
        .interact_text();

    match selection {
        Ok(item) => item,
        Err(error) => {
            println!("Error: {}", error);
            "Error".to_string()
        }
    }
}

fn handle_select(selection: Option<usize>, items: Vec<String>) -> String {
    match selection {
        Some(index) => items[index].clone(),
        None => "Selection cancelled".to_string(),
    }
}

fn handle_select_bool(selection: Option<bool>) -> bool {
    selection.unwrap_or(false)
}
