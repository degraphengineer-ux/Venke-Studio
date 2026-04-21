const projectData = {
  urban: {
    images: [
      "./assets/images/venke-image_1.png",
      "./assets/images/venke-image_2.png",
      "./assets/images/venke-image_3.png",
    ],
    meta: { date: "2024.01.10", loc: "KALOBEYEI_CORE", tech: "23MM_DIGITAL" },
  },
  tech: {
    images: [
      "./assets/images/venke-image_4.png",
      "./assets/images/venke-image_5.png",
    ],
    meta: { date: "2024.01.10", loc: "NAIROBI_CORE", tech: "35MM_DIGITAL" },
  },
  nature: {
    images: [
      "./assets/images/venke-image_4.png",
      "./assets/images/venke-image_5.png",
    ],
    meta: { date: "2024.01.10", loc: "KAKUMA_CORE", tech: "34MM_DIGITAL" },
  },
};

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

  function openGallery(displayName, imageArray, metaData) {
    // 1. Update Title
    document.getElementById("active-title").innerText =
      `LOCAL_FILE: /${displayName.toUpperCase()}`;

    const scrollArea = document.querySelector(".parallax-scroll-area");
    const metaContainer = document.getElementById("meta-container");
    const overlay = document.getElementById("gallery-overlay");

    // 2. Clear previous content
    scrollArea.innerHTML = "";
    if (metaContainer) metaContainer.innerHTML = ""; // Clear sidebar

    // 3. Inject Metadata into Sidebar
    if (metaData && metaContainer) {
      metaContainer.innerHTML = `
      <div class="meta-item"><span>ENCRYPTION_DATE</span>${metaData.date}</div>
      <div class="meta-item"><span>GEOGRAPHIC_LOC</span>${metaData.loc}</div>
      <div class="meta-item"><span>ACQUISITION_TECH</span>${metaData.tech}</div>
    `;
    }

    // 4. Inject Images
    imageArray.forEach((imgSrc) => {
      const block = document.createElement("div");
      block.className = "parallax-block";
      block.innerHTML = `<img src="${imgSrc}" class="p-img" alt="${displayName}">`;
      scrollArea.appendChild(block);
    });

    // 5. Animation Logic
    gsap.set(overlay, { display: "block", opacity: 0 });
    gsap.to(overlay, { opacity: 1, duration: 0.5 });
    document.body.style.overflow = "hidden";

    gsap.from(".parallax-block", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out",
    });

    refreshParallax();
  }

  function refreshParallax() {
    // Kill old ScrollTriggers to save memory
    ScrollTrigger.getAll()
      .filter((st) => st.vars.scroller === "#gallery-overlay")
      .forEach((st) => st.kill());

    gsap.utils.toArray(".p-img").forEach((img) => {
      gsap.to(img, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: img.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          scroller: "#gallery-overlay", // Keep scroll inside the overlay
        },
      });
    });
  }

  document.querySelectorAll(".folder").forEach((folder) => {
    folder.addEventListener("click", () => {
      const title = folder.getAttribute("data-gallery");
      const projectId = folder.getAttribute("data-project");
      const project = projectData[projectId];

      if (project) {
        openGallery(title, project.images, project.meta);
      }
    });
  });

  function closeGallery() {
    gsap.to("#gallery-overlay", {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        document.getElementById("gallery-overlay").style.display = "none";
        // FIX: Restore background scrolling
        document.body.style.overflow = "auto";
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

  // [PART 3: INSIDE DOMContentLoaded]

  let runningTotal = 0;
  document.querySelectorAll(".terminal-item").forEach((item) => {
    item.addEventListener("click", () => {
      const price = parseInt(item.getAttribute("data-price"));
      const statusBit = item.querySelector(".status-bit");

      if (item.classList.toggle("active-service")) {
        runningTotal += price;
        if (statusBit) statusBit.innerText = "[STATUS: ACTIVE]";
      } else {
        runningTotal -= price;
        if (statusBit) statusBit.innerText = "[STATUS: IDLE]";
      }

      // Animate the price counter
      gsap.to("#terminal-total", {
        innerText: runningTotal,
        duration: 0.8,
        snap: { innerText: 1 },
        ease: "power2.out",
      });
    });
  });
});

window.onbeforeunload = () => {
  for (const form of document.getElementsByTagName("form")) {
    form.reset();
  }
};
