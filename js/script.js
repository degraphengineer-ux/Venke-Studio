document.addEventListener("DOMContentLoaded", () => {
  const clickSound = new Audio("./assets/audio/click_1.wav");

  document.querySelectorAll("button, a, .folder").forEach((el) => {
    el.addEventListener("click", () => {
      clickSound.currentTime = 0;
      clickSound.play();
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  // 1. Skill Bar Animation
  gsap.utils.toArray(".progress-fill").forEach((bar) => {
    gsap.to(bar, {
      scrollTrigger: {
        trigger: bar,
        start: "top 90%",
      },
      width: bar.getAttribute("data-percent"),
      duration: 2,
      ease: "power4.out",
    });
  });

  function openGallery(projName) {
    document.getElementById("active-title").innerText =
      `LOCAL_FILE: /${projName.toUpperCase()}`;
    const overlay = document.getElementById("gallery-overlay");

    gsap.set(overlay, { display: "block", opacity: 0 });
    gsap.to(overlay, { opacity: 1, duration: 0.5 });

    // Animate individual images sliding up
    gsap.from(".parallax-block", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  document.querySelectorAll(".folder").forEach((folder) => {
    folder.addEventListener("click", () => {
      const type = folder.getAttribute("data-gallery");
      openGallery(type);
    });
  });

  function closeGallery() {
    gsap.to("#gallery-overlay", {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        document.getElementById("gallery-overlay").style.display = "none";
      },
    });
  }

  const closeBtn = document.querySelector(".close-btn");

  closeBtn.addEventListener("click", () => {
    closeGallery();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
      closeGallery();
    }
  });

  // Global Parallax Logic
  gsap.utils.toArray(".p-img").forEach((img) => {
    gsap.to(img, {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: img.parentElement,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        scroller: "#gallery-overlay", // Important: scroll inside overlay
      },
    });
  });

  // Hover effect for the whole contact section
  gsap.from(".contact-info, .contact-form-container", {
    scrollTrigger: {
      trigger: ".contact-archive",
      start: "top 70%",
    },
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1.2,
    ease: "expo.out",
  });

  // Update the local clock
  function updateClock() {
    const now = new Date();
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    };
    document.getElementById("local-clock").innerText = now.toLocaleTimeString(
      "en-US",
      options,
    );
  }
  setInterval(updateClock, 1000);
  updateClock();

  // page transition
  const transition = document.getElementById("page-transition");

  // Animate IN (on page load)
  window.addEventListener("load", () => {
    gsap.to(transition, {
      y: "-100%",
      duration: 1,
      ease: "power4.inOut",
    });
  });

  // Animate OUT (before navigating)
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const target = link.getAttribute("href");

      gsap.to(transition, {
        y: "0%",
        duration: 0.6,
        ease: "power4.inOut",
        onComplete: () => {
          window.location.hash = target;
          gsap.to(transition, {
            y: "-100%",
            duration: 0.6,
          });
        },
      });
    });
  });

  // magnetic
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });

  // 3d titl
  document.querySelectorAll(".folder, .price-folder").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotationY: x * 15,
        rotationX: -y * 15,
        transformPerspective: 1000,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    });
  });

  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;
    const progress = (scroll / height) * 100;

    gsap.to("#progress-bar", {
      width: progress + "%",
    });
  });
});

window.onbeforeunload = () => {
  for (const form of document.getElementsByTagName("form")) {
    form.reset();
  }
};
