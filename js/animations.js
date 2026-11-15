/**
 * Animations Specialist Module - Kedarling Kanade Portfolio
 * Features:
 * 1. Interactive Star/Particle Constellation Canvas
 * 2. Typewriter Role Rotating Reveal
 * 3. Intersection Observer Scroll Reveals
 * 4. Animated Number Counters
 * 5. Interactive Cursor Glow
 */

class PortfolioAnimations {
  constructor() {
    this.canvas = document.getElementById("particlesCanvas");
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.particles = [];
    this.particleCount = 55;
    this.mouse = { x: null, y: null, radius: 120 };
    this.animFrameId = null;
    this.typewriterIndex = 0;
    this.roleIndex = 0;
    this.isDeleting = false;
    this.typeSpeed = 90;
  }

  init() {
    // Check reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      console.log("Reduced motion preferred: skipping heavy particle loops.");
      return;
    }

    this.initCanvas();
    this.initTypewriter();
    this.initScrollReveal();
    this.initCursorGlow();
    this.initScrollProgress();
    this.initBackToTop();
  }

  /**
   * Interactive Background Canvas (Nodes + Connections)
   */
  initCanvas() {
    if (!this.canvas || !this.ctx) return;

    const resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.createParticles();
    };

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
    });

    window.addEventListener("mouseout", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.animateParticles();
  }

  createParticles() {
    this.particles = [];
    const count = window.innerWidth < 768 ? 25 : this.particleCount;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1,
        color: i % 3 === 0 ? "rgba(56, 189, 248, 0.6)" : (i % 3 === 1 ? "rgba(168, 85, 247, 0.6)" : "rgba(6, 182, 212, 0.6)")
      });
    }
  }

  animateParticles() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      // Connect with nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 100)})`;
          this.ctx.lineWidth = 0.75;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      // Connect to mouse pointer
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const mdx = p.x - this.mouse.x;
        const mdy = p.y - this.mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < this.mouse.radius) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(168, 85, 247, ${0.3 * (1 - mDist / this.mouse.radius)})`;
          this.ctx.lineWidth = 1;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.stroke();
        }
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.animateParticles());
  }

  /**
   * Rotating Role Typewriter
   */
  initTypewriter() {
    const el = document.getElementById("typewriterRole");
    if (!el) return;

    const data = window.portfolioStorage ? window.portfolioStorage.getData() : CONFIG.defaultData;
    const roles = (data.profile && data.profile.roles && data.profile.roles.length)
      ? data.profile.roles
      : [
          "Python Full Stack Developer",
          "AI & Machine Learning Enthusiast",
          "Cloud & DevOps Engineer",
          "Generative AI Specialist"
        ];

    const tick = () => {
      const currentRole = roles[this.roleIndex % roles.length];

      if (this.isDeleting) {
        el.textContent = currentRole.substring(0, this.typewriterIndex - 1);
        this.typewriterIndex--;
      } else {
        el.textContent = currentRole.substring(0, this.typewriterIndex + 1);
        this.typewriterIndex++;
      }

      let delta = this.typeSpeed;

      if (!this.isDeleting && this.typewriterIndex === currentRole.length) {
        delta = 1800; // Pause at full word
        this.isDeleting = true;
      } else if (this.isDeleting && this.typewriterIndex === 0) {
        this.isDeleting = false;
        this.roleIndex++;
        delta = 400; // Pause before typing next word
      } else if (this.isDeleting) {
        delta = 45;
      }

      setTimeout(tick, delta);
    };

    tick();
  }

  /**
   * Scroll Progress Indicator
   */
  initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;

    window.addEventListener("scroll", () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      bar.style.width = `${scrolled}%`;
    }, { passive: true });
  }

  /**
   * Floating Back to Top Button
   */
  initBackToTop() {
    const btn = document.getElementById("backToTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /**
   * Cursor Glow Light Follower
   */
  initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateGlow = () => {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(updateGlow);
    };

    updateGlow();
  }

  /**
   * Intersection Observer for Fade-ins & Animated Counters
   */
  initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          
          // Check if this element or child has an animated counter
          const counters = entry.target.querySelectorAll(".counter-number");
          counters.forEach(counter => {
            this.animateCounter(counter);
          });

          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".animate-fade-in-up").forEach(el => {
      revealObserver.observe(el);
    });
  }

  /**
   * Animate Numeric Counter
   */
  animateCounter(element) {
    if (element.dataset.counted) return;
    element.dataset.counted = "true";

    const targetRaw = element.getAttribute("data-target") || element.innerText;
    // Check if it's a numeric value or has suffix/prefix like 100/100 or 9.19
    const target = parseFloat(targetRaw);
    if (isNaN(target)) return;

    const isFloat = targetRaw.includes(".");
    const duration = 1500;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;

      if (isFloat) {
        element.textContent = current.toFixed(2);
      } else {
        element.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = targetRaw; // Ensure exact final string
      }
    };

    requestAnimationFrame(updateCount);
  }
}

// Global instance
window.portfolioAnimations = new PortfolioAnimations();
