// (async () => {
//   await loadSlim(tsParticles);

//   await tsParticles.load({
//     id: "tsparticles",
//     options: {
//       fpsLimit: 60,
//       interactivity: {
//         events: {
//           onClick: { enable: true, mode: "push" },
//           onHover: { enable: true, mode: ["grab", "repulse"] },
//           resize: true,
//         },
//         modes: {
//           push: { quantity: 4 },
//           repulse: { distance: 80, duration: 0.4 },
//           grab: { distance: 110, links: { opacity: 0.3 } }
//         },
//       },
//       particles: {
//         color: { value: "#ffffff" },
//         links: { 
//           enable: true, 
//           distance: 100, 
//           color: "#ffffff", 
//           opacity: 0.15, 
//           width: 0.5 
//         },
//         move: {
//           direction: "none",
//           enable: true,
//           outModes: { default: "out" },
//           random: false,
//           speed: { min: 0.1, max: 0.8 },
//           straight: false,
//         },
//         number: {
//           density: { enable: true, width: 400, height: 400 },
//           value: 90,
//         },
//         opacity: {
//           value: { min: 0.1, max: 0.6 },
//           animation: {
//             enable: true,
//             speed: 1,
//             sync: false,
//             mode: "auto",
//             startValue: "random",
//             destroy: "none",
//           },
//         },
//         shape: { type: "circle" },
//         size: {
//           value: { min: 0.5, max: 1.5 },
//         },
//       },
//       detectRetina: true,
//     }
//   });
// })();


const openTerminalButton = document.getElementById("open-terminal-button");
const closeTerminalButton = document.getElementById("close-terminal-button");
const sapplingTerminal = document.getElementById("terminal-container");
const terminalTop = document.getElementById("terminal-top-container");
const body = document.getElementById("body");

let isDragging = false;

let offsetX = 0;
let offsetY = 0;
let screenX = 0, screenY = 0, terminalX = 0, terminalY = 0;

// function openTerminal(){
//   sapplingTerminal.classList.add("active");
  
//   const rect = sapplingTerminal.getBoundingClientRect();
//   sapplingTerminal.style.left = (screen.width / 2 - sapplingTerminal.width / 2) + 'px';
//   sapplingTerminal.style.top = (screen.height/2 - sapplingTerminal.height / 2) + 'px';
// }

function openTerminal() {
  sapplingTerminal.classList.add("active");

  // Set centered position in px so JS drag math stays consistent
  const rect = sapplingTerminal.getBoundingClientRect();
  sapplingTerminal.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
  sapplingTerminal.style.top  = (window.innerHeight / 2 - rect.height / 2) + 'px';
}


function closeTerminal(){
  sapplingTerminal.classList.remove("active")
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


 
  // function mouseClkCordVW(){
  //   body.addEventListener("mousemove", (e) =>{
  //     if (e.buttons == 0) {
  //       offsetXVW = e.screenX;
  //       offsetYVW = e.screenY;
  //       console.log(`X_Screen : ${offsetXVW}, Y_Screen : ${offsetYVW}`);
  //       differenceX = offsetXVW-offsetX;
  //       differenceY = offsetYVW - offsetY;
  //       console.log(`Diff : ${differenceX}, ${differenceY}`);
  //     }
  //   })
  // }

  // if (e.button){
  //   sapplingTerminal.style.boxShadow = "4px 4px 0px rgba(0, 0, 0, 1)";
  // }
openTerminalButton.addEventListener("click", openTerminal);
closeTerminalButton.addEventListener("click", closeTerminal);
mouseClkCordTop();
printEverthing();
// mouseClkCordVW();