#!/usr/bin/env node

const { Command } = require("commander");
const inquirer = require("inquirer");
const os = require("os");
const fs = require("fs");
const path = require("path");

const prompt = inquirer.createPromptModule();
const program = new Command();

program.name("mycli").description("A simple CLI tool").version("1.0.0");

// Greet Command
program
  .command("greet <name>")
  .description("Greet someone")
  .action((name) => {
    console.log(`Hello, ${name}! 🥳`);
  });

// Interactive Command
program
  .command("interact")
  .description("Start interactive mode")
  .action(async () => {
    const answers = await prompt([
      {
        type: "input",
        name: "name",
        message: "What is your name?",
      },
    ]);
    console.log(`Nice to meet you, ${answers.name}! 🎉`);
  });

// 📡 System Info Command
program
  .command("sysinfo")
  .description("Display system information")
  .action(() => {
    displaySystemInfo();
  });

// 💻 Function to Display System Info
function displaySystemInfo() {
  console.log("🖥️  System Information:");
  console.log(`- Hostname      : ${os.hostname()}`);
  console.log(`- OS Type       : ${os.type()}`);
  console.log(`- Platform      : ${os.platform()}`);
  console.log(`- Architecture  : ${os.arch()}`);
  console.log(`- CPUs          : ${os.cpus().length} cores`);
  console.log(`- Total Memory  : ${(os.totalmem() / 1e9).toFixed(2)} GB`);
  console.log(`- Free Memory   : ${(os.freemem() / 1e9).toFixed(2)} GB`);
  console.log(`- Uptime        : ${(os.uptime() / 60).toFixed(2)} minutes`);
}

// 📁 Create Folder Command
program
  .command("mkdir <folderName>")
  .description("Create a new folder")
  .action((folderName) => {
    createFolder(folderName);
  });

// 📄 Create File Command
program
  .command("touch <fileName>")
  .description("Create a new file")
  .action((fileName) => {
    createFile(fileName);
  });

// 🧠 Function to Create a Folder
function createFolder(folderName) {
  const fullPath = path.resolve(process.cwd(), folderName);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
    console.log(`✅ Folder created: ${fullPath}`);
  } else {
    console.log(`⚠️ Folder already exists: ${fullPath}`);
  }
}

// 🧠 Function to Create a File
function createFile(fileName) {
  const fullPath = path.resolve(process.cwd(), fileName);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, ""); // Create empty file
    console.log(`✅ File created: ${fullPath}`);
  } else {
    console.log(`⚠️ File already exists: ${fullPath}`);
  }
}

program
  .command("write <fileName> <text...>")
  .description("Write text into a file (overwrites if exists)")
  .action((fileName, text) => {
    const content = text.join(" ");
    writeToFile(fileName, content);
  });

function writeToFile(fileName, content) {
  const fullPath = path.resolve(process.cwd(), fileName);
  try {
    fs.appendFileSync(fullPath, content + "\n");
    console.log(`➕ Appended text to file: ${fullPath}`);
  } catch (err) {
    console.error(`❌ Failed to append: ${err.message}`);
  }
}

program
  .command("read <fileName>")
  .description("Read and display content from a file")
  .action((fileName) => {
    readFromFile(fileName);
  });

  function readFromFile(fileName) {
  const fullPath = path.resolve(process.cwd(), fileName);
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      console.log(`📄 Contents of ${fileName}:\n`);
      console.log(content);
    } else {
      console.log(`❌ File not found: ${fullPath}`);
    }
  } catch (err) {
    console.error(`❌ Error reading file: ${err.message}`);
  }
}


program.parse(process.argv);
