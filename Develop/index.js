const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
var basicInfo;

//Initial function prompts for username and calls other functions
getUsername();

async function getUsername() {
  try {
    const { user } = await inquirer.prompt({
      message: "Enter a user name:",
      name: "user",
    });

    //
    await getData(user);
  
    getProjectInfo(user);
  } catch (err) {
    console.log(err);
  }
}

//This function will take a 'user' parameter and retrive the data from github api
async function getData(user) {
  //let basicInfo;

  //Get call is made to github api and received array is saved in 'data' variable
  const { data } = await axios.get(
    `https://api.github.com/users/${user}/events/public`
  );

  //For loop checks if the 'commits' key exists in payload object in the received data and saves the data in 'basicInfo' variable. Once the data is found the loop terminates (The reson for this check is because not all the objects in the 'data' array have 'commits' key)
  for (var i = 0; i < data.length; i++) {
    if (data[i].payload.hasOwnProperty("commits")) {
      basicInfo = {
        author: data[i].payload.commits[0].author.name,
        email: data[i].payload.commits[0].author.email,
        avatar: data[i].actor.avatar_url,
      };
      //this terminates the loop
      i = data.length;
    }
  }
  

  //Coverting the raw text to proper format and saving to ''basicData
  let basicData = `# My Github Profile\n![Profile Image](${basicInfo.avatar})\\
  Author Name: ${basicInfo.author}\nEmail: ${basicInfo.email}\n`;

  //This function creates the Readme file with basicInfo
  createBasicInfo(basicData);

  //getData function ends
}

//Creating createBasicInfo Function
function createBasicInfo(basicData) {
  fs.writeFile(`Readme.md`, basicData, function (err) {
    if (err) {
      console.log(err);
    }
  });
}

//Prompt project questions
async function getProjectInfo(user) {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is your project name: ",
        name: "project",
      },
      {
        type: "input",
        message:
          "Provide the github repo name for this project (To generate the a badge): ",
        name: "repo",
      },
      {
        type: "input",
        message: "Provide a brief description of the project: ",
        name: "description",
      },
      {
        type: "input",
        message: "Installation: ",
        name: "installation",
      },
      {
        type: "input",
        message: "Usage: ",
        name: "usage",
      },
      {
        type: "input",
        message: "License: ",
        name: "license",
      },
      {
        type: "input",
        message: "Contributors: ",
        name: "contributors",
      },
      {
        type: "input",
        message: "Tests: ",
        name: "tests",
      },
    ])
    .then(function (response) {
      //passing response
      //This functions appends the Project info to the previously created readme file
      appendReadme(response, user);
    });
}

//creating the appendReadme Function
function appendReadme(response, user) {
  //saving the badge 
  let badge = `![GitHub commit activity](https://img.shields.io/github/last-commit/${user}/${response.repo}?style=for-the-badge)`;
  let tableContent= `## Table of Content\n[Description](##Description)<br/>[Installation](##Installation)<br/>[Usage](##Usage)<br/>[License](##License)<br/>[Contributors](##Contributors)<br/>[Tests](##Tests)`

  //formating the user responses and saving to 'data' variable
  let data = `# ${response.project.toUpperCase()}\n${badge}\n\n${tableContent}\n\n## Description\n${
    response.description
  }\n\n## Installation\n${
    response.installation
  }\n\n## Usage\n${response.usage}\n\n## License\n${
    response.license
  }\n\n## Contributors\n${response.contributors}\n\n## Tests\n${
    response.tests
  }\n\n`;

  //adding the data to readme file
  fs.appendFile("Readme.md", data, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("You Readme.md file has been generated successfully!\n(If you see errors in the Readme.md file, make sure you entered the correct Github Username and Repo for the project)");
  });
}



