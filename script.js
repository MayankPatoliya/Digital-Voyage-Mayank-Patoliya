// --- 1. CONFIG & UTILS ---
gsap.registerPlugin(ScrollTrigger);

const updateClock = () => {
  const now = new Date();
  const clockElement = document.getElementById("clock");
  if (clockElement) {
    clockElement.innerText = now.toLocaleTimeString("en-US", { hour12: false });
  }
};
setInterval(updateClock, 1000);
updateClock();

// --- 2. CURSOR LOGIC ---
const cursorInner = document.querySelector(".cursor-inner");
const cursorOuter = document.querySelector(".cursor-outer");
let mouseX = 0,
  mouseY = 0;
let cursorX = 0,
  cursorY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Inner dot moves instantly
  if (cursorInner) gsap.set(cursorInner, { x: mouseX - 5, y: mouseY - 5 });
});

// Smooth follow for outer circle
gsap.ticker.add(() => {
  const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
  cursorX += (mouseX - cursorX) * dt;
  cursorY += (mouseY - cursorY) * dt;
  if (cursorOuter) gsap.set(cursorOuter, { x: cursorX - 20, y: cursorY - 20 });
});

// Hover Effects for Cursor
document.querySelectorAll("a, .nav-item, button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    gsap.to(cursorOuter, {
      scale: 1.5,
      borderColor: "transparent",
      backgroundColor: "rgba(255,255,255,0.2)",
      duration: 0.3,
    });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(cursorOuter, {
      scale: 1,
      borderColor: "white",
      backgroundColor: "transparent",
      duration: 0.3,
    });
  });
});

// --- 3. PRELOADER ---
const initSite = () => {
  const tl = gsap.timeline();

  tl.to("#loader-progress", {
    width: "100%",
    duration: 1.5,
    ease: "power2.inOut",
  })
    .to(
      "#loader-text",
      {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=1"
    )
    .to("#preloader", {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
    })
    .to(
      "#spline-bg",
      {
        opacity: 1,
        duration: 1.5,
      },
      "-=0.8"
    )
    .to(
      ".hero-line",
      {
        y: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: "power4.out",
      },
      "-=0.5"
    )
    .to(
      ".hero-text",
      {
        opacity: 1,
        y: 0,
        duration: 1,
      },
      "-=0.8"
    )
    // Reveal cursor after preloader
    .to(
      ".cursor-ball",
      {
        opacity: 1,
        duration: 0.5,
      },
      "-=0.5"
    );
};

window.addEventListener("load", () => {
  setTimeout(initSite, 500);
});

// --- 4. SCROLL ANIMATIONS ---
gsap.utils.toArray(".fade-in").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
      },
    }
  );
});

// Responsive Horizontal Scroll Logic
const horizontalSection = document.getElementById("work");
let mm = gsap.matchMedia();

mm.add("(min-width: 768px)", () => {
  // Desktop Only: Horizontal Scroll
  const panels = gsap.utils.toArray(".panel");
  gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: horizontalSection,
      pin: true,
      scrub: 1,
      snap: 1 / (panels.length - 1),
      end: () => "+=" + horizontalSection.offsetWidth * 2,
    },
  });
});

gsap.to(".hero-line", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

// --- 6. COLOR THEME SWITCHER (Light/Dark) ---
ScrollTrigger.create({
  trigger: "#contact",
  start: "top 85%",
  end: "bottom top",
  onEnter: () => {
    gsap.to("nav", {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderColor: "rgba(0, 0, 0, 0.1)",
      duration: 0.3,
    });
    gsap.to(".nav-item", { color: "#0a0a0a", duration: 0.3 });
  },
  onLeaveBack: () => {
    gsap.to("nav", {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
      duration: 0.3,
    });
    gsap.to(".nav-item", { color: "#ffffff", duration: 0.3 });
  },
});

ScrollTrigger.create({
  trigger: "#contact",
  start: "top 10%",
  end: "bottom top",
  onEnter: () => {
    gsap.to("header .font-serif", { color: "#0a0a0a", duration: 0.3 });
    gsap.to("header .uppercase", { color: "#4b5563", duration: 0.3 });
    gsap.to("#clock", { color: "#0a0a0a", duration: 0.3 });
    gsap.to(".cursor-outer", { borderColor: "#0a0a0a", duration: 0.3 });
    gsap.to(".cursor-inner", { backgroundColor: "#0a0a0a", duration: 0.3 });
  },
  onLeaveBack: () => {
    gsap.to("header .font-serif", { color: "#ffffff", duration: 0.3 });
    gsap.to("header .uppercase", { color: "#9ca3af", duration: 0.3 });
    gsap.to("#clock", { color: "#ffffff", duration: 0.3 });
    gsap.to(".cursor-outer", { borderColor: "#ffffff", duration: 0.3 });
    gsap.to(".cursor-inner", { backgroundColor: "#ffffff", duration: 0.3 });
  },
});

// --- 7. PROJECT MODAL LOGIC ---
const projects = [
  {
    id: 0,
    title: "Fretboard Memorizer",
    category: "Music Theory tool",
    year: "2024",
    description:
      "The Fretboard Memorizer is a web-based educational application designed to help guitarists and bassists master the fretboard. By gamifying the process of note identification, the tool addresses a common pain point for musicians: bridging the gap between musical theory and physical instrument proficiency.",
    image: "./image/freatboard.png",
  },
  {
    id: 1,
    title: "AI-Powered Cyberbullying Detection System",
    category: "CyberCrime",
    year: "2025",
    description:
      "This project is an end-to-end machine learning application designed to automatically detect and flag suspicious or bullying communication on social platforms. By integrating a Natural Language Processing (NLP) pipeline with a responsive web interface, the system provides real-time sentiment analysis to foster safer online environments.",
    image: "./image/cyberbullying.png",
  },
];

const modal = document.getElementById("project-modal");
const modalContent = document.getElementById("modal-content");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalCategory = document.getElementById("modal-category");
const modalYear = document.getElementById("modal-year");

window.openProject = (index) => {
  const p = projects[index];
  if (!p) return;

  // Populate data
  modalTitle.innerText = p.title;
  modalDesc.innerText = p.description;
  modalCategory.innerText = p.category;
  modalYear.innerText = p.year;
  modalImg.src = p.image;

  // Show Modal Container
  modal.style.pointerEvents = "auto";
  document.body.style.overflow = "hidden"; // Prevent background scrolling

  // Animation
  gsap.to(modal, { opacity: 1, duration: 0.4 });
  gsap.fromTo(
    modalContent,
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", delay: 0.1 }
  );
  gsap.fromTo(
    modalImg,
    { scale: 1.2 },
    { scale: 1, duration: 1.2, ease: "power2.out" }
  );
};

window.closeProject = () => {
  gsap.to(modalContent, {
    y: 100,
    opacity: 0,
    duration: 0.4,
    ease: "power3.in",
  });
  gsap.to(modal, {
    opacity: 0,
    duration: 0.4,
    delay: 0.1,
    onComplete: () => {
      modal.style.pointerEvents = "none";
      document.body.style.overflow = ""; // Restore background scrolling
    },
  });
};
