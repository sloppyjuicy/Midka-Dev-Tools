use dialoguer::{console::Term, theme::ColorfulTheme, Select};

fn main() {
    let items = vec!["foo", "bar", "baz"];

    let selection = Select::with_theme(&ColorfulTheme::default())
        .with_prompt("Select an item")
        .items(&items)
        .default(0)
        .interact_on_opt(&Term::stderr());

    match selection {
        Ok(item) => handle_select(item, items),
        Err(error) => println!("Error: {}", error),
    }
}

fn handle_select(selection: Option<usize>, items: Vec<&str>) {
    match selection {
        Some(index) => println!("You selected: {:?}", items[index]),
        None => println!("You canceled the selection"),
    }
}
