const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");

getUsername();

async function getUsername() {
  try {
    const { user } = await inquirer.prompt({
      message: "Enter a user name:",
      name: "user",
    });

    getData(user);
    getProjectInfo(user);
  } catch (err) {
    console.log(err);
  }
}

//This function will take a 'user' parameter and retrive the data from github api
async function getData(user) {
  const { data } = await axios.get(
    `https://api.github.com/users/${user}/events/public`
  );

  for (var i = 0; i < data.length; i++) {
    if (data[i].payload.hasOwnProperty("commits")) {
      let author = data[i].payload.commits[0].author.name;
      let email = data[i].payload.commits[0].author.email;
      let avatar = data[i].actor.avatar_url;
      i = data.length;
    }
  }
}

//Prompt project questions
async function getProjectInfo(user) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your project name?",
        name: "project",
      },
      {
        type: "input",
        message:
          "Provide the github repo name for this project (To generate the Commits Badge): ",
        name: "repo",
      },
      {
        type: "input",
        message: "Provide a brief description of the project!",
        name: "description",
      },
      {
        type: "input",
        message: "Installation?",
        name: "installation",
      },
      {
        type: "input",
        message: "Usage?",
        name: "usage",
      },
      {
        type: "input",
        message: "License?",
        name: "license",
      },
      {
        type: "input",
        message: "Contributors?",
        name: "contributors",
      },
      {
        type: "input",
        message: "Tests",
        name: "tests",
      },
    ])
    .then(function (response) {
      createReadme(response, user);
    });
}

function createReadme(response, user) {
  let badge = `![GitHub commit activity](https://img.shields.io/github/commit-activity/m/${user}/${response.repo}?style=plastic)`;

  let data = `# ${response.project}\n\n## Description\n${response.description}\n\n## Table of Contents\n TBD\n\n## Installation\n${response.installation}\n\n## Usage\n${response.usage}\n\n## License\n${response.license}\n\n## Tests\n${response.tests}\n\n`;

  fs.writeFile("ReadmeTest.md", data, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("Success!");
  });
}

// fs.appendFile('Readme.md',FinalData, function(err){
//     if(err){
//         console.log(err)
//     }

// } )

/////////////
//badge
//![GitHub commit activity](https://img.shields.io/github/commit-activity/m/JSON-D3RULO/project-1?style=plastic)
