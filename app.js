let controller;
let slideScene;
let pageScene;
let detailScene;

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
const cursor = document.querySelector(".cursor");
const cursorText = cursor.querySelector("span");
const burger = document.querySelector(".burger");

// circle following the cursor effect
function cursorfnc(e) {
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    cursor.classList.add("nav-active");
  } else {
    cursor.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    cursor.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    cursorText.innerText = "tap";
  } else {
    cursor.classList.remove("explore-active");
    cursorText.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

// Nav full page
function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "45", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-45", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%" }); //expanding the page
    document.body.classList.add("hide"); //to hide scrolling (overflow)
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "0", y: 0, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%" }); //shrinking the page
    document.body.classList.remove("hide");
  }
}
// scroll up the page when loaded
// barba.hooks.beforeOnce((data) => {
//   windows.scrollTo(0, 0);
// });
// Barbra page transition
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",

      //beforeenterand beforeleave: run certain functionality to certain page is this case HOME page
      beforeEnter() {
        animateSlides();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      },
    },
    {
      namespace: "explore",
      beforeEnter() {
        logo.href = "../index.html";
        exploreAnimation();
      },
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
    },
  ],
  transitions: [
    {
      leave(data) {
        let done = this.async();
        const jp = gsap.timeline();
        jp.to(data.current.container, {
          opacity: 0,
          duration: 1,
        });
        jp.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter(data) {
        let done = this.async();
        window.scrollTo(0, 0);
        const jp = gsap.timeline();
        jp.from(data.next.container, {
          opacity: 0,
          duration: 1,
        });
        jp.fromTo(
          ".swipe",
          1,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        jp.fromTo(".nav-header", 1, { y: "-100%" }, { y: "0%" }, "-=1.5"); //just for nav to show up if you scroll fast
      },
    },
  ],
  // transitions: [
  //   {
  //     leave({ current, next }) {
  //       let done = this.async();
  //       // Animation
  //       const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  //       tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
  //     },
  //     enter({ current, next }) {
  //       // Scroll to the top
  //       windows.scrollTo(0, 0);
  //       let done = this.async();
  //       const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
  //       tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
  //     },
  //   },
  // ],
});

// Scroll animation for the product page
function exploreAnimation() {
  controller = new ScrollMagic.Controller();
  const slides = document.querySelectorAll(".detail-slide");
  slides.forEach((slide, index, slides) => {
    const slideTl = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1]; //to select the next slide
    const nextImg = nextSlide.querySelector("img");
    slideTl.fromTo(slide, { opacity: 1 }, { opacity: 0 });
    slideTl.fromTo(nextSlide, { opacity: 0 }, { opacity: 1 }, "-=0.5");
    slideTl.fromTo(nextImg, { x: "50%" }, { x: "0%" });
    //Scene
    detailScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "90%",
      triggerHook: 0,
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(slideTl)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "explore",
        indent: 200,
      })
      .addTo(controller);
  });
}
// Events listeners
burger.addEventListener("click", navToggle);
window.addEventListener("mousemove", cursorfnc);
window.addEventListener("mouseover", activeCursor); // for the color change

// animateSlides(); //here the animation work for all pages we put it in barba to run it on specific page
