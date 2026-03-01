/**
 * Digital Voyage Portfolio - Core Logic
 * High-performance animations, fluid cursor tracking, and refined UI transitions.
 */

gsap.registerPlugin(ScrollTrigger);

// --- 1. CLOCK UTILITY ---
// Optimized to only update when values actually change
const updateClock = () => {
  const clock = document.getElementById("clock");
  if (clock) {
    const now = new Date();
    clock.innerText = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
};
setInterval(updateClock, 1000);
updateClock();

// --- 2. REFINED CUSTOM CURSOR ---
// Using quickSetter for better performance (bypasses GSAP property parser)
const cursorInner = document.querySelector(".cursor-inner");
const cursorOuter = document.querySelector(".cursor-outer");

if (cursorInner && cursorOuter) {
  const xInnerSetter = gsap.quickSetter(cursorInner, "x", "px");
  const yInnerSetter = gsap.quickSetter(cursorInner, "y", "px");
  const xOuterSetter = gsap.quickSetter(cursorOuter, "x", "px");
  const yOuterSetter = gsap.quickSetter(cursorOuter, "y", "px");

  let mouseX = 0,
    mouseY = 0;
  let cx = 0,
    cy = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant inner dot
    xInnerSetter(mouseX - 4);
    yInnerSetter(mouseY - 4);
  });

  // Smooth lerp for outer ring
  gsap.ticker.add(() => {
    const lerp = 0.15;
    cx += (mouseX - cx) * lerp;
    cy += (mouseY - cy) * lerp;
    xOuterSetter(cx - 18);
    yOuterSetter(cy - 18);
  });

  // Interaction states
  const interactiveElements = document.querySelectorAll(
    "a, button, .nav-item, .project-card",
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursorOuter, {
        scale: 1.8,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: "0px",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(cursorInner, { scale: 0.5, duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursorOuter, {
        scale: 1,
        backgroundColor: "transparent",
        borderWidth: "1px",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(cursorInner, { scale: 1, duration: 0.3 });
    });
  });
}

// --- 3. PRELOADER & INITIAL SEQUENCING ---
window.addEventListener("load", () => {
  // Force scroll to top on reload to prevent ScrollTrigger calc errors
  window.scrollTo(0, 0);

  const tl = gsap.timeline({
    onComplete: () => ScrollTrigger.refresh(),
  });

  tl.to("#loader-progress", {
    width: "100%",
    duration: 1.2,
    ease: "power2.inOut",
  })
    .to("#loader-text", { y: 0, duration: 0.6, ease: "power2.out" })
    .to("#preloader", {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut",
      delay: 0.2,
    })
    .to("#spline-bg", { opacity: 1, duration: 2, ease: "none" }, "-=0.8")
    .to(
      ".hero-line",
      {
        y: 0,
        stagger: 0.1,
        duration: 1.4,
        ease: "power4.out",
      },
      "-=1.2",
    )
    .to(
      ".hero-text",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      },
      "-=1",
    )
    .to(".cursor-ball", { opacity: 1, duration: 0.5 }, "-=0.5");
});

// --- 4. SCROLL REVEAL ANIMATIONS ---
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
      toggleActions: "play none none reverse",
    },
  });
});

// --- 5. HORIZONTAL SCROLL (Desktop Only) ---
let mm = gsap.matchMedia();
mm.add("(min-width: 769px)", () => {
  const horizontalSection = document.getElementById("work");
  const horizontalScroll = document.getElementById("horizontal-scroll");
  const panels = gsap.utils.toArray(".panel");

  const scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: horizontalSection,
      pin: true,
      scrub: 1,
      snap: {
        snapTo: 1 / (panels.length - 1),
        duration: 0.1,
        delay: 0.1,
      },
      end: () => "+=" + horizontalScroll.offsetWidth,
      invalidateOnRefresh: true, // Vital for responsiveness
    },
  });

  return () => {
    scrollTween.kill();
  };
});

// --- 6. THEME ADAPTATION ---
// Unified theme switcher for better synchronization
const themeTrigger = ScrollTrigger.create({
  trigger: "#contact",
  start: "top 50%",
  onToggle: (self) => {
    const isDark = !self.isActive;
    gsap.to("body", {
      backgroundColor: isDark ? "#0a0a0a" : "#fdfbf7",
      duration: 0.6,
    });
    gsap.to("#floating-nav", {
      backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      duration: 0.6,
    });
    gsap.to(".nav-item", {
      color: isDark ? "#ffffff" : "#0a0a0a",
      duration: 0.6,
    });
    gsap.to(".header-text, .header-sub, #clock", {
      color: isDark ? "#ffffff" : "#0a0a0a",
      duration: 0.6,
    });

    // Sync cursor color with theme
    if (cursorOuter && cursorInner) {
      gsap.to(cursorOuter, {
        borderColor: isDark ? "#ffffff" : "#0a0a0a",
        duration: 0.6,
      });
      gsap.to(cursorInner, {
        backgroundColor: isDark ? "#ffffff" : "#0a0a0a",
        duration: 0.6,
      });
    }
  },
});

// --- 7. PROJECT MODAL CONTROLLER ---
const projectData = [
  {
    title: "Fretboard Memorizer",
    category: "Educational Tool",
    desc: "A gamified web application for guitarists to master note identification across the fretboard using the Web Speech API and custom intervals.",
    img: "image/fretboard.png",
    year: "2024",
  },
  {
    title: "AI Cyberbullying Detection",
    category: "NLP • Machine Learning",
    desc: "An end-to-end ML application that detects and flags offensive communication in real-time using Scikit-learn, TF-IDF, and a Flask-based API.",
    img: "image/cyberbullying.png",
    year: "2025",
  },
  {
    title: "AI Music Therapy System",
    category: "AI • Audio Processing",
    desc: "Engineered a research-driven AI system that provides personalized music therapy. The core model dynamically analyzes and adapts to user emotions in real-time, delivering a highly responsive and customized therapeutic audio experience.",
    img: "image/ai_music_therapy.png",
    year: "2026",
  },
];

const modal = document.getElementById("project-modal");
const modalContent = document.getElementById("modal-content");

window.openProject = (index) => {
  const p = projectData[index];
  if (!p || !modal || !modalContent) return;

  // Population
  document.getElementById("modal-title").innerText = p.title;
  document.getElementById("modal-category").innerText = p.category;
  document.getElementById("modal-desc").innerText = p.desc;
  document.getElementById("modal-img").src = p.img;
  document.getElementById("modal-year").innerText = "Year: " + p.year;

  modal.classList.remove("pointer-events-none");

  const modalTl = gsap.timeline();
  modalTl
    .to(modal, { opacity: 1, duration: 0.4 })
    .fromTo(
      modalContent,
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power4.out" },
      "-=0.2",
    );

  document.body.style.overflow = "hidden";
};

window.closeProject = () => {
  if (!modal || !modalContent) return;

  const modalTl = gsap.timeline({
    onComplete: () => {
      modal.classList.add("pointer-events-none");
      document.body.style.overflow = "";
    },
  });

  modalTl
    .to(modalContent, {
      y: 40,
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      ease: "power2.in",
    })
    .to(modal, { opacity: 0, duration: 0.3 }, "-=0.2");
};

// Keyboard Accessibility
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("pointer-events-none")) {
    closeProject();
  }
});

// Refresh ScrollTrigger on resize to ensure calculations remain "perfect"
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
