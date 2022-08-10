let controller;
let slideScene;
let pageScene;

function animateSlides() {
  // Init Controller
  controller = new ScrollMagic.Controller();
  // Select some things
  const slides = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  slides.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector(".reveal-img");
    const img = slide.querySelector("img");
    const revealText = slide.querySelector(".reveal-text");
    //GSAP
    const slideTl = gsap.timeline({
      default: { ease: "power2.inOut" },
    });
    slideTl.fromTo(revealImg, { x: "0%" }, { x: "100%", duration: 1 });
    slideTl.fromTo(img, { scale: 2 }, { scale: 1, duration: 1 }, "-=1");
    //-=1 so that it animate at the same time with the revealImg
    slideTl.fromTo(revealText, { x: "0%" }, { x: "100%", duration: 1 }, "-=1");
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
    // New animation
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1]; //to select the next slide
    pageTl.fromTo(nextSlide, { y: "0%" }, { y: "30%" });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: "30%" }, { y: "0%" }, "-=0.5");
    // Create new scene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "90%", //take the whole width
      triggerHook: 0,
    })
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "page",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false }) //pushFollowers to elemenate the weird big white space betwen slides
      .setTween(pageTl)
      .addTo(controller);
  });
}
let cursor = document.querySelector(".cursor");
function cursorfnc(e) {
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    console.log(item.id);
    cursor.classList.add("nav-active");
  } else {
    cursor.classList.remove("nav-active");
  }
}

window.addEventListener("mousemove", cursorfnc);
window.addEventListener("mouseover", activeCursor);

animateSlides();
