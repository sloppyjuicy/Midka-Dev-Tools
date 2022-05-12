use serde::Deserialize;
use toml::value::Table;

#[derive(Deserialize, Debug)]
pub struct MainConfig {
    pub templates: Vec<String>,
}

#[derive(Deserialize, Debug)]
pub struct TemplateConfig {
    pub name: String,
    pub description: String,
    pub language: Vec<String>,
    pub args: Option<Vec<Table>>,
    pub init_commands: Table,
    pub install_commands: Table,
}

pub fn get_template_config(path: &str) -> Result<TemplateConfig, anyhow::Error> {
    let config_file = std::fs::read_to_string(path)?;
    let config: TemplateConfig =
        toml::from_str(&config_file).expect("Something went wrong parsing the file");

    Ok(config)
}

pub fn get_main_config(folder: &str) -> Result<MainConfig, anyhow::Error> {
    let config_file = std::fs::read_to_string(folder.to_owned() + "/config.toml")
        .expect("Something went wrong reading the file");
    let config: MainConfig =
        toml::from_str(&config_file).expect("Something went wrong parsing the file");

    Ok(config)
}
