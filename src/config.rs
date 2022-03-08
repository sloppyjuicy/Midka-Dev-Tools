use serde::Deserialize;

#[derive(Deserialize, Debug)]
pub struct MainConfig {
    pub templates: Vec<String>,
}

#[derive(Deserialize, Debug)]
pub struct TemplateConfig {
    pub name: String,
    pub description: String,
    pub language: Vec<String>,
}

#[derive(Deserialize)]
struct LanguageConfig {
    command: String,
}

pub fn get_template_config(path: &str) -> TemplateConfig {
    let config_file = std::fs::read_to_string(path).expect("Something went wrong reading the file");
    let config: TemplateConfig =
        toml::from_str(&config_file).expect("Something went wrong parsing the file");

    println!("{:?}", config);

    config
}

pub fn get_main_config(folder: &str) -> MainConfig {
    let config_file = std::fs::read_to_string(folder.to_owned() + "/config.toml")
        .expect("Something went wrong reading the file");
    let config: MainConfig =
        toml::from_str(&config_file).expect("Something went wrong parsing the file");

    println!("{:?}", config);

    config
}
