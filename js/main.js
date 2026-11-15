/**
 * Main Controller Module - Kedarling Kanade Portfolio
 * Coordinates all data rendering, theme toggle, modals, lightboxes & interactions
 */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Storage & Auth
  await window.portfolioStorage.init();
  await window.portfolioAuth.init();

  // 2. Initialize Theme
  initTheme();

  // 3. Render all Dynamic Content from Data Store
  renderAllSections();

  // 4. Initialize Animations, Projects & Contact modules
  if (window.portfolioAnimations) window.portfolioAnimations.init();
  if (window.portfolioProjects) window.portfolioProjects.init();
  if (window.portfolioContact) window.portfolioContact.init();

  // 5. Initialize Navigation Scroll Effects & Active Spy
  initNavigation();

  // 6. Listen for Admin Data Changes
  window.addEventListener("portfolioDataChanged", () => {
    renderAllSections();
  });
});

/**
 * Theme Toggle Handler (Dark / Light Mode)
 */
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const storedTheme = localStorage.getItem("kedarling_theme") || "dark";

  document.documentElement.setAttribute("data-theme", storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("kedarling_theme", next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.getElementById("themeToggleIcon");
  if (!icon) return;
  if (theme === "light") {
    icon.className = "bi bi-moon-stars-fill text-warning";
  } else {
    icon.className = "bi bi-sun-fill text-warning";
  }
}

/**
 * Navbar Scroll & Active Link Spy
 */
function initNavigation() {
  const navbar = document.querySelector(".navbar-custom");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }

    // Active Section Spy
    let currentId = "";
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  }, { passive: true });

  // Mobile menu close on click
  const navbarCollapse = document.getElementById("navbarNav");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        bsCollapse?.hide();
      }
    });
  });
}

/**
 * Master Render of All Sections
 */
function renderAllSections() {
  const data = window.portfolioStorage.getData();

  renderHero(data.profile);
  renderAbout(data.about, data.profile);
  renderEducation(data.education);
  renderSkills(data.skills);
  renderInternships(data.internships);
  renderAchievements(data.achievements);
  renderCertifications(data.certifications);
  renderResumes(data.resumes);
  renderContactInfo(data.profile);
  renderFooter(data.profile);
}

/**
 * Render Hero Section
 */
function renderHero(profile) {
  if (!profile) return;

  const nameEl = document.getElementById("heroName");
  const headlineEl = document.getElementById("heroHeadline");
  const availabilityBadge = document.getElementById("availabilityBadge");
  const heroAvatar = document.getElementById("heroAvatar");
  const counterPython = document.getElementById("counterPythonScore");

  if (nameEl) nameEl.textContent = profile.name || "Kedarling Kanade";
  if (headlineEl) headlineEl.textContent = profile.headline || "";
  
  if (availabilityBadge) {
    availabilityBadge.innerHTML = `
      <span class="radar-dot"></span>
      <span>${escapeHtml(profile.availability || "Available for Opportunities")}</span>
    `;
  }

  if (heroAvatar && profile.photoUrl) {
    heroAvatar.src = profile.photoUrl;
    heroAvatar.alt = profile.name;
  }

  if (counterPython && profile.pythonScore) {
    counterPython.textContent = profile.pythonScore;
  }
}

/**
 * Render About Me
 */
function renderAbout(about, profile) {
  if (!about) return;

  const bioEl = document.getElementById("aboutBioText");
  const highlightsEl = document.getElementById("aboutHighlights");
  const careerInterestsEl = document.getElementById("aboutCareerInterests");
  const professionalGoalsEl = document.getElementById("aboutProfessionalGoals");
  const aboutAvatar = document.getElementById("aboutAvatar");

  if (bioEl) bioEl.textContent = about.bio || "";
  if (careerInterestsEl) careerInterestsEl.textContent = about.careerInterests || "";
  if (professionalGoalsEl) professionalGoalsEl.textContent = about.professionalGoals || "";
  if (aboutAvatar && profile && profile.photoUrl) {
    aboutAvatar.src = profile.photoUrl;
  }

  if (highlightsEl && Array.isArray(about.highlights)) {
    highlightsEl.innerHTML = about.highlights.map(h => `
      <div class="col-md-6 mb-3">
        <div class="about-highlight-box h-100">
          <div class="about-highlight-title">
            <i class="bi bi-patch-check-fill text-info"></i>
            <span>${escapeHtml(h.title)}</span>
          </div>
          <p class="text-secondary-custom mb-0 small">${escapeHtml(h.description)}</p>
        </div>
      </div>
    `).join("");
  }
}

/**
 * Render Education Timeline
 */
function renderEducation(educationList) {
  const container = document.getElementById("educationContainer");
  if (!container || !Array.isArray(educationList)) return;

  container.innerHTML = educationList.filter(e => e.isPublished !== false).map((edu, idx) => `
    <div class="col-lg-6 mb-4 animate-fade-in-up is-visible">
      <div class="glass-card p-4 h-100">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <span class="badge bg-primary-subtle text-info border border-info border-opacity-25 px-3 py-1 rounded-pill">
            <i class="bi bi-calendar-event me-1"></i> ${escapeHtml(edu.duration)}
          </span>
          <span class="badge bg-success-subtle text-success border border-success border-opacity-25 px-3 py-1 rounded-pill fw-bold">
            ${escapeHtml(edu.score)}
          </span>
        </div>
        <h4 class="fw-bold text-white mb-1">${escapeHtml(edu.degree)}</h4>
        <h6 class="text-info mb-3">
          <i class="bi bi-building me-1"></i> ${escapeHtml(edu.institution)} 
          <span class="text-muted small">(${escapeHtml(edu.location)})</span>
        </h6>
        <p class="text-secondary-custom mb-0 small">${escapeHtml(edu.description)}</p>
      </div>
    </div>
  `).join("");
}

/**
 * Render Technical Skills Categorized
 */
function renderSkills(skillsList) {
  const container = document.getElementById("skillsContainer");
  if (!container || !Array.isArray(skillsList)) return;

  // Group by category
  const categories = [
    { name: "Programming", icon: "bi-terminal" },
    { name: "AI & Machine Learning", icon: "bi-cpu" },
    { name: "Generative AI", icon: "bi-stars" },
    { name: "Cloud", icon: "bi-cloud-check" },
    { name: "DevOps", icon: "bi-box-seam" },
    { name: "Frontend", icon: "bi-layout-text-window-reverse" },
    { name: "Backend", icon: "bi-hdd-network" },
    { name: "Monitoring", icon: "bi-speedometer2" },
    { name: "Database", icon: "bi-database" },
    { name: "Tools", icon: "bi-tools" }
  ];

  const published = skillsList.filter(s => s.isPublished !== false);

  container.innerHTML = categories.map(cat => {
    const items = published.filter(s => s.category === cat.name);
    if (items.length === 0) return "";

    const tagsHtml = items.map(skill => `
      <span class="skill-tag" title="Proficiency: ${escapeHtml(skill.level || 'Proficient')}">
        <i class="bi ${escapeHtml(skill.icon || 'bi-check-circle')} text-info"></i>
        <span>${escapeHtml(skill.name)}</span>
        <span class="skill-level-badge">${escapeHtml(skill.level || 'Core')}</span>
      </span>
    `).join("");

    return `
      <div class="col-lg-6 col-xl-4 mb-4 animate-fade-in-up is-visible">
        <div class="glass-card skill-category-card">
          <div class="skill-category-header">
            <h5 class="skill-category-title text-white">
              <i class="bi ${cat.icon} text-info"></i> ${cat.name}
            </h5>
            <span class="text-muted small">${items.length} skills</span>
          </div>
          <div class="skill-tag-container">
            ${tagsHtml}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * Render Internships Timeline
 */
function renderInternships(internships) {
  const container = document.getElementById("internshipsTimeline");
  if (!container || !Array.isArray(internships)) return;

  container.innerHTML = internships.filter(i => i.isPublished !== false).map(item => {
    const respHtml = (item.responsibilities || []).map(r => `<li>${escapeHtml(r)}</li>`).join("");
    const certBtn = item.certificateImage ? `
      <button class="btn btn-sm btn-outline-glow mt-3 view-cert-btn" data-cert-title="${escapeHtml(item.company + ' Internship Certificate')}" data-cert-img="${escapeHtml(item.certificateImage)}" data-cert-pdf="${escapeHtml(item.certificatePdf || '')}">
        <i class="bi bi-file-earmark-check me-1"></i> View Internship Certificate
      </button>
    ` : "";

    return `
      <div class="timeline-item animate-fade-in-up is-visible">
        <div class="timeline-node"></div>
        <div class="glass-card timeline-card">
          <h3 class="timeline-role text-white">${escapeHtml(item.role)}</h3>
          <div class="timeline-company">${escapeHtml(item.company)}</div>
          <div class="timeline-meta">
            <span><i class="bi bi-calendar3 me-1 text-info"></i> ${escapeHtml(item.duration)}</span>
            <span><i class="bi bi-geo-alt me-1 text-info"></i> ${escapeHtml(item.mode || 'Remote')}</span>
            ${item.certificateCode ? `<span><i class="bi bi-patch-check me-1 text-success"></i> ID: ${escapeHtml(item.certificateCode)}</span>` : ''}
          </div>
          <ul class="timeline-responsibilities">
            ${respHtml}
          </ul>
          ${certBtn}
        </div>
      </div>
    `;
  }).join("");

  // Attach certificate preview event
  container.querySelectorAll(".view-cert-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-cert-title");
      const img = btn.getAttribute("data-cert-img");
      const pdf = btn.getAttribute("data-cert-pdf");
      openCertificateModal(title, img, pdf);
    });
  });
}

/**
 * Render Achievements Gallery
 */
function renderAchievements(achievements) {
  const container = document.getElementById("achievementsContainer");
  if (!container || !Array.isArray(achievements)) return;

  container.innerHTML = achievements.filter(a => a.isPublished !== false).map(ach => `
    <div class="col-lg-4 col-md-6 mb-4 animate-fade-in-up is-visible">
      <div class="glass-card achievement-card" data-ach-id="${ach.id}">
        <div class="achievement-img-wrapper">
          <img src="${escapeHtml(ach.image)}" alt="${escapeHtml(ach.title)}" class="achievement-img" loading="lazy">
          <div class="achievement-overlay">
            <i class="bi bi-zoom-in"></i>
          </div>
        </div>
        <div class="achievement-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="badge bg-info-subtle text-info border border-info border-opacity-25 px-2 py-1 rounded-pill small">
              ${escapeHtml(ach.category || 'Achievement')}
            </span>
            <span class="text-muted small">${escapeHtml(ach.date || '')}</span>
          </div>
          <h5 class="achievement-title text-white">${escapeHtml(ach.title)}</h5>
          <div class="achievement-org">${escapeHtml(ach.organization)}</div>
          <p class="text-secondary-custom small mb-0 mt-2">${escapeHtml(ach.description)}</p>
        </div>
      </div>
    </div>
  `).join("");

  // Lightbox click on achievements
  container.querySelectorAll(".achievement-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = card.getAttribute("data-ach-id");
      const ach = achievements.find(x => x.id === id);
      if (ach) openLightboxModal(ach.title, ach.image, ach.description, ach.organization);
    });
  });
}

/**
 * Render Certifications
 */
function renderCertifications(certifications) {
  const container = document.getElementById("certificationsContainer");
  if (!container || !Array.isArray(certifications)) return;

  container.innerHTML = certifications.filter(c => c.isPublished !== false).map(cert => {
    const skillsHtml = (cert.skills || []).map(s => `<span class="tech-badge">${escapeHtml(s)}</span>`).join("");
    return `
      <div class="col-lg-4 col-md-6 mb-4 animate-fade-in-up is-visible">
        <div class="glass-card cert-card">
          <div class="cert-preview-wrapper">
            <img src="${escapeHtml(cert.image)}" alt="${escapeHtml(cert.title)}" class="cert-preview-img" loading="lazy">
          </div>
          <div class="cert-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-primary-subtle text-info border border-info border-opacity-25 px-2 py-1 rounded-pill small">
                ${escapeHtml(cert.date || 'Certified')}
              </span>
              ${cert.credentialId ? `<span class="text-muted font-mono small">${escapeHtml(cert.credentialId)}</span>` : ''}
            </div>
            <h5 class="cert-title text-white">${escapeHtml(cert.title)}</h5>
            <div class="cert-issuer">${escapeHtml(cert.issuer)}</div>
            <div class="project-tech-stack mt-2 mb-3">
              ${skillsHtml}
            </div>
            <div class="mt-auto d-flex gap-2">
              <button class="btn btn-sm btn-outline-glow w-100 preview-cert-btn" data-cert-title="${escapeHtml(cert.title)}" data-cert-img="${escapeHtml(cert.image)}" data-cert-pdf="${escapeHtml(cert.pdf || '')}">
                <i class="bi bi-eye me-1"></i> Preview
              </button>
              ${cert.pdf ? `
                <a href="${escapeHtml(cert.pdf)}" download class="btn btn-sm btn-secondary-custom" title="Download Certificate PDF">
                  <i class="bi bi-download"></i>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".preview-cert-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-cert-title");
      const img = btn.getAttribute("data-cert-img");
      const pdf = btn.getAttribute("data-cert-pdf");
      openCertificateModal(title, img, pdf);
    });
  });
}

/**
 * Render Resume Download Center
 */
function renderResumes(resumes) {
  const container = document.getElementById("resumesContainer");
  if (!container || !Array.isArray(resumes)) return;

  container.innerHTML = resumes.filter(r => r.isPublished !== false).map(res => `
    <div class="col-lg-4 col-md-6 mb-4 animate-fade-in-up is-visible">
      <div class="glass-card resume-download-card ${res.isDefault ? 'is-default-resume' : ''}">
        <div class="resume-preview-box">
          <img src="${escapeHtml(res.previewImage || 'assets/images/resumes/resume_python.png')}" alt="${escapeHtml(res.title)}" loading="lazy">
          <span class="resume-category-tag">${escapeHtml(res.category || 'Resume')}</span>
          ${res.isDefault ? '<span class="badge bg-success position-absolute top-0 end-0 m-2 px-2 py-1"><i class="bi bi-star-fill me-1"></i> Primary</span>' : ''}
        </div>
        <div class="resume-card-body">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <h4 class="resume-card-title text-white mb-0">${escapeHtml(res.title)}</h4>
            <span class="badge bg-secondary-subtle text-light small">${escapeHtml(res.version || 'v2026')}</span>
          </div>
          <p class="resume-card-desc mt-2">${escapeHtml(res.description)}</p>
          <div class="resume-card-actions mt-auto">
            <a href="${escapeHtml(res.pdfUrl)}" download="${escapeHtml(res.title.replace(/\s+/g, '_'))}.pdf" class="btn btn-primary-custom flex-grow-1 resume-download-trigger" data-title="${escapeHtml(res.title)}">
              <i class="bi bi-download me-1"></i> Download PDF
            </a>
            <button class="btn btn-secondary-custom preview-resume-btn" data-title="${escapeHtml(res.title)}" data-pdf="${escapeHtml(res.pdfUrl)}">
              <i class="bi bi-eye"></i> Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  // Attach SweetAlert on download
  container.querySelectorAll(".resume-download-trigger").forEach(link => {
    link.addEventListener("click", () => {
      const title = link.getAttribute("data-title");
      if (window.Swal) {
        Swal.fire({
          icon: "success",
          title: "Download Started",
          text: `"${title}" is downloading. Thank you for your interest!`,
          timer: 3000,
          timerProgressBar: true,
          background: "#0d1527",
          color: "#f8fafc",
          confirmButtonColor: "#38bdf8"
        });
      }
    });
  });

  // Attach resume preview modal
  container.querySelectorAll(".preview-resume-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title");
      const pdf = btn.getAttribute("data-pdf");
      openResumeModal(title, pdf);
    });
  });
}

/**
 * Render Contact Details & Links
 */
function renderContactInfo(profile) {
  if (!profile) return;
  const emailLinks = document.querySelectorAll(".profile-email-link");
  const phoneLinks = document.querySelectorAll(".profile-phone-link");
  const locationEls = document.querySelectorAll(".profile-location-text");
  const githubLinks = document.querySelectorAll(".profile-github-link");
  const linkedinLinks = document.querySelectorAll(".profile-linkedin-link");

  emailLinks.forEach(el => {
    el.href = `mailto:${profile.email}`;
    el.textContent = profile.email;
  });

  phoneLinks.forEach(el => {
    el.href = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`;
    el.textContent = profile.phone;
  });

  locationEls.forEach(el => {
    el.textContent = profile.location;
  });

  githubLinks.forEach(el => {
    el.href = profile.github;
  });

  linkedinLinks.forEach(el => {
    el.href = profile.linkedin;
  });
}

/**
 * Render Footer
 */
function renderFooter(profile) {
  const yearEl = document.getElementById("copyrightYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Certificate Preview Modal Helper
 */
function openCertificateModal(title, imageSrc, pdfUrl) {
  const modalEl = document.getElementById("certificateModal");
  if (!modalEl || !window.bootstrap) return;

  const modalTitle = document.getElementById("certModalTitle");
  const modalImage = document.getElementById("certModalImage");
  const modalDownloadBtn = document.getElementById("certModalDownload");

  if (modalTitle) modalTitle.textContent = title;
  if (modalImage) modalImage.src = imageSrc;
  if (modalDownloadBtn) {
    if (pdfUrl || imageSrc) {
      modalDownloadBtn.href = pdfUrl || imageSrc;
      modalDownloadBtn.style.display = "inline-flex";
    } else {
      modalDownloadBtn.style.display = "none";
    }
  }

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

/**
 * Lightbox Modal Helper for Achievements
 */
function openLightboxModal(title, imageSrc, description, organization) {
  const modalEl = document.getElementById("lightboxModal");
  if (!modalEl || !window.bootstrap) return;

  const modalTitle = document.getElementById("lightboxTitle");
  const modalImage = document.getElementById("lightboxImage");
  const modalDesc = document.getElementById("lightboxDescription");
  const modalOrg = document.getElementById("lightboxOrg");

  if (modalTitle) modalTitle.textContent = title;
  if (modalImage) modalImage.src = imageSrc;
  if (modalDesc) modalDesc.textContent = description;
  if (modalOrg) modalOrg.textContent = organization;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

/**
 * Resume PDF Preview Modal Helper
 */
function openResumeModal(title, pdfUrl) {
  const modalEl = document.getElementById("resumePreviewModal");
  if (!modalEl || !window.bootstrap) return;

  const modalTitle = document.getElementById("resumeModalTitle");
  const modalFrame = document.getElementById("resumeModalIframe");
  const modalDownload = document.getElementById("resumeModalDownload");

  if (modalTitle) modalTitle.textContent = title;
  if (modalFrame) modalFrame.src = pdfUrl;
  if (modalDownload) modalDownload.href = pdfUrl;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
}

/**
 * Utility: HTML Escape
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
