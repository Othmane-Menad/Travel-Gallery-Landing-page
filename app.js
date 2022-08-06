let controller;
let slideScene;

function animateSlides() {
  // Init Controller
  controller = new ScrollMagic.Controller();
  // Select some things
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  slides.forEach((slide) => {
    console.log(slide);
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
  });
}

animateSlides();
