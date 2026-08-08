/**
 * projects.js
 *
 * All project data lives here.
 * To add a new project, append one object to this array.
 * No HTML, CSS, or layout code needs to change.
 *
 * Fields:
 *   title         {string}  — Project name (shown as large heading)
 *   description   {string}  — 1-2 sentence blurb shown below the title
 *   image         {string}  — URL to a 16:9 background image (1920×1080 recommended)
 *   imagePosition {string}  — CSS object-position value for the background image.
 *                             Controls which part of the image stays visible when
 *                             cropped on narrow/tall viewports.
 *                             Examples: "center" (default), "top", "bottom",
 *                             "center top", "70% 30%"
 *   demoUrl       {string}  — URL for the Demo button
 *   githubUrl     {string}  — URL for the GitHub button
 */
const projects = [
  {
    title: "Jasoos",
    description:
      "A spy keychain which can record high qualithy audio/conversation upto 32gb storage.",
    image: "./Assets/Jasoos_Banner.png",
    imagePosition: "center",   // change to "top" if the subject is near the top of the image
    demoUrl: "https://github.com/Sappling-Chores/Jasoos",
    githubUrl: "https://github.com/Sappling-Chores/Jasoos",
  },
  {
  title: "Cyprus",
  description:
    "A handwired split keyboard/macros with high speed bluetooth connection.",
  image: "./Assets/Cyprus_Banner.png",
  imagePosition: "center",   // change to "top" if the subject is near the top of the image
  demoUrl: "https://github.com/Sappling-Chores/Cyprus",
  githubUrl: "https://github.com/Sappling-Chores/Cyprus",
  },
//   {
//     title: "Project Showcase",
//     description:
//       "An interactive portfolio page featuring animated sections and smooth transitions to highlight personal and collaborative work.",
//     image: "https://picsum.photos/1600/900?random=1",
//     imagePosition: "center",
//     demoUrl: "#",
//     githubUrl: "#",
//   },
//   {
//     title: "Dev Playground",
//     description:
//       "A sandbox environment for rapid UI prototyping — experiment with layouts, color systems, and component ideas without any build step.",
//     image: "https://picsum.photos/1600/900?random=2",
//     imagePosition: "center top", // example: keep the upper portion visible on portrait phones
//     demoUrl: "#",
//     githubUrl: "#",
//   },
];
