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

    getData(user)

  } catch (err) {
    console.log(err);
  }
}

//This function will take a 'user' parameter and retrive the data from github api
async function getData(user) {
  const { data } = await axios.get(
    `https://api.github.com/users/${user}/events/public`
  ); //https://api.github.com/users/${user}
  //console.log(data[0].actor.avatar_url);

  for (var i = 0; i < data.length; i++) {
    if (data[i].payload.hasOwnProperty("commits")) {
      let author = data[i].payload.commits[0].author.name;
      let email = data[i].payload.commits[0].author.email;
      let avatar = data[i].actor.avatar_url;
      console.log(author+ " " +email+" "+avatar)
      i = data.length;
    }
  }
}

// fs.appendFile('Readme.md',process.argv[2] + '\n', function(err){
//     if(err){
//         console.log(err)
//     }
//     console.log(`Sucess!`)
// } )

/////////////
const questions = [];

function writeToFile(fileName, data) {}

function init() {}

init();
