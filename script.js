
const openTerminalButton = document.getElementById("open-terminal-button");
const closeTerminalButton = document.getElementById("close-terminal-button");
const sapplingTerminal = document.getElementById("terminal-container");
const terminalTop = document.getElementById("terminal-top-container");
const terminalOutput = document.getElementById("terminal-output");
const Command = document.getElementById("command")

let isDragging = false;

let offsetX = 0;
let offsetY = 0;
let screenX = 0, screenY = 0, terminalX = 0, terminalY = 0;


  const githubIcon = document.querySelector('.github-icon');
  
  githubIcon.addEventListener('mouseenter', () =>{
    githubIcon.classList.add('hovered');
    githubIcon.classList.remove('unhovered');
  })
  
  githubIcon.addEventListener('mouseleave', () => {
    githubIcon.classList.add('unhovered');
    githubIcon.classList.remove('hovered');
  })


  openTerminalButton.addEventListener('mouseenter', () =>{
  openTerminalButton.classList.add('hovered');
  openTerminalButton.classList.remove('unhovered');
  })
  
  openTerminalButton.addEventListener('mouseleave', () => {
  openTerminalButton.classList.add('unhovered');
  openTerminalButton.classList.remove('hovered');
  })
  
function openTerminal() {
  sapplingTerminal.classList.add("active");
  openTerminalButton.classList.add("opened");
  const rect = sapplingTerminal.getBoundingClientRect();
  sapplingTerminal.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
  sapplingTerminal.style.top  = (window.innerHeight / 2 - rect.height / 2) + 'px';

  Command.focus();
}


function closeTerminal(){
  sapplingTerminal.classList.remove("active");
  openTerminalButton.classList.remove("opened");
  const rect = sapplingTerminal.getBoundingClientRect();
  sapplingTerminal.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
  sapplingTerminal.style.top  = (window.innerHeight / 2 - rect.height / 2) + 'px';
}

function mouseClkCordTop(){
    terminalTop.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      offsetX = e.clientX - sapplingTerminal.getBoundingClientRect().left;
      offsetY = e.clientY - sapplingTerminal.getBoundingClientRect().top;
    }
    });

    terminalTop.addEventListener("mousemove", (e) => {
      if (e.buttons === 0) return;
      sapplingTerminal.style.left = (e.clientX - offsetX) + 'px';
      sapplingTerminal.style.top  = (e.clientY - offsetY) + 'px';
    });


  }

  const commandActions = {
  help:     () => printToTerminal("Commands: about, projects, blog, email", "output"),
  about:    () => window.location.href = "/About/index.html",   
  projects: () => window.location.href = "/Projects/index.html",
  blog:     () => window.location.href = "/blog/index.html",
  email:    () => window.location.href = "mailto:itsmohammadsarfaraz@gmail.com",
  github:   () => window.location.href = "https://github.com/Sappling-Chores",
};


  function commmandInput(){
    Command.addEventListener("keydown", (e) => {
      if (e.key === "Enter"){
        const cmd = Command.value.trim();
        if (!cmd) return;

        printToTerminal(cmd, "input");
        Command.value = "";

        if (commandActions[cmd]){
        commandActions[cmd]();
    }
      }
    })
  }


printToTerminal("Use this terminal for navigation");
printToTerminal("");
printToTerminal("Click on the command");
printToTerminal("");
printToTerminal("Or use the terminal")
printToTerminal("");
printToTerminal("");
printToTerminal("");


const commands = ["help", "about", "projects", "blog", "email", "github"];

for (let i = 0; i < commands.length; i++) {
  printToTerminal(commands[i], "cmdclk");
}


function printToTerminal(text, type = "output") {
    const line = document.createElement("div");
    line.classList.add("terminal-line", type);
    if (line.textContent = type === "cmdclk"){
      line.addEventListener("click", (e) => {
        commandActions[text]();
      });
    }
    line.textContent = type === "input" ? "> " + text : text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

  const myTime = document.getElementById("clock");

  function currentTime(){
    const now = new Date();
    const options = {
      timeZone : "Asia/Kolkata",
      hour12 : false,
      hour : "2-digit",
      minute : "2-digit",
      second : "2-digit" };

      const timeString = now.toLocaleString("en-IN", options);
      myTime.textContent = timeString; 

    }

    setInterval(currentTime, 1000);
    currentTime();
  

openTerminalButton.addEventListener("click", openTerminal);
closeTerminalButton.addEventListener("click", closeTerminal);
mouseClkCordTop();
commmandInput();
