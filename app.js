let controller;
let slideScene;

function animateSlides() {
  // Init Controller
  controller = new ScrollMagic.Controller();
  // Select some things
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  slides.forEach((slide) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP
    const slideTl = gsap.timeline({
      default: { duration: 5, ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%", duration: 1 });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1, duration: 1 }, "-=1");
    //-=1 so that it animate at the same time with the revealImg
    slideTl.fromTo(
      revealText,
      { x: "-500%" },
      { x: "100%", duration: 1 },
      "-=1"
    );
    slideTl.fromTo(nav, { y: "-100%" }, { y: "0%", duration: 1 }, "-=0.5");
    //Create scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "slide",
      })
      .addTo(controller);
  });
}

animateSlides();
