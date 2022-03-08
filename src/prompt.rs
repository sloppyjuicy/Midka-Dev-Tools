use dialoguer::{console::Term, theme::ColorfulTheme, Confirm, Select};

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

pub fn prompt_select<'a>(question: &'a str, options: Vec<&'a str>) -> &'a str {
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
