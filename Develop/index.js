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

    const { data } = await axios.get(
      `https://api.github.com/users/${user}/events/public`
    ); //https://api.github.com/users/${user}
    //console.log(data[0].actor.avatar_url);

    for (var i = 0; i < data.length; i++) {
      if (data[i].payload.hasOwnProperty("commits")) {
        let author = data[i].payload.commits[0].author.name
        let email = data[i].payload.commits[0].author.email
           console.log(`Author: ${author} Email: ${email}`);
          i = data.length;  
      }
    }
  } catch (err) {
    console.log(err);
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
