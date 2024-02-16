#!/usr/bin/env node
const { execSync } = require("node:child_process");
const figlet = require("figlet");

const runCommand = (command) => {
  try {
    execSync(`${command}`, { sudo: "inherit" });
    return true;
  } catch (err) {
    console.log(`Failed to execute ${command}`, e);
    return false;
  }
};
figlet("Congratulation!!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});

const repoName = process.argv[2] || "express-mongo-boilerplate";
const gitCheckoutCommand = `git clone --depth 1 https://github.com/ahmmedabir9/express-rest-boilerplate.git ${repoName}`;
const installDepsCom = `cd ${repoName} && npm install`;
const removeTemplateFileCommands = `cd ${repoName} && rm -r bin .git`;

console.log(`Cloning the repository with the name ${repoName}`);
const checkout = runCommand(gitCheckoutCommand);

if (!checkout) process.exit(-1);

const removeTemplateFolders = runCommand(removeTemplateFileCommands);

if (!removeTemplateFolders) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCom);

if (!installedDeps) process.exit(-1);

console.log(`A boiler plate  by group of Software Engineer from Implevista`);
const openCode = `cd ${repoName} && code .`;

runCommand(openCode);
