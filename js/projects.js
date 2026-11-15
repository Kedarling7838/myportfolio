/**
 * Projects Module - Kedarling Kanade Portfolio
 * Handles filterable project portfolio, dynamic card rendering, and architecture detail modal
 */

class PortfolioProjects {
  constructor() {
    this.currentFilter = "All";
    this.container = document.getElementById("projectsContainer");
    this.modalEl = document.getElementById("projectDetailModal");
    this.modalInstance = null;
  }

  init() {
    this.container = document.getElementById("projectsContainer");
    this.modalEl = document.getElementById("projectDetailModal");
    if (this.modalEl && window.bootstrap) {
      this.modalInstance = new bootstrap.Modal(this.modalEl);
    }

    this.initFilterButtons();
    this.render();

    // Listen for storage changes
    window.addEventListener("portfolioDataChanged", () => {
      this.render();
    });
  }

  initFilterButtons() {
    const filterButtons = document.querySelectorAll(".portfolio-filters .filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        filterButtons.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.getAttribute("data-filter") || "All";
        this.render();
      });
    });
  }

  render() {
    if (!this.container) return;

    const data = window.portfolioStorage ? window.portfolioStorage.getData() : CONFIG.defaultData;
    const allProjects = (data.projects || []).filter(p => p.isPublished !== false);

    // Apply filter
    const filtered = allProjects.filter(p => {
      if (this.currentFilter === "All") return true;
      if (p.category && p.category.toLowerCase().includes(this.currentFilter.toLowerCase())) return true;
      if (p.tags && p.tags.some(t => t.toLowerCase().includes(this.currentFilter.toLowerCase()))) return true;
      return false;
    });

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div class="col-12 text-center py-5">
          <div class="glass-card p-5 d-inline-block">
            <i class="bi bi-folder2-open text-muted fs-1 mb-3 d-block"></i>
            <h5 class="text-white">No projects found in category "${this.escapeHtml(this.currentFilter)}"</h5>
            <p class="text-muted mb-0">Select another filter or add projects via the Admin Dashboard.</p>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(p => this.createProjectCardHtml(p)).join("");

    // Attach click events for "View Details"
    this.container.querySelectorAll(".view-project-details-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-project-id");
        this.openModal(id);
      });
    });
  }

  createProjectCardHtml(project) {
    const tagsHtml = (project.tags || []).slice(0, 4).map(t => `<span class="tech-badge">${this.escapeHtml(t)}</span>`).join("");
    const githubBtn = project.github ? `
      <a href="${this.escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary-custom" title="GitHub Repository">
        <i class="bi bi-github"></i> Code
      </a>
    ` : "";

    const demoBtn = project.demo ? `
      <a href="${this.escapeHtml(project.demo)}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary-custom" title="Live Demo">
        <i class="bi bi-box-arrow-up-right"></i> Live
      </a>
    ` : "";

    const imageSrc = project.image || "assets/images/projects/smartbite.png";

    return `
      <div class="col-lg-4 col-md-6 mb-4 animate-fade-in-up is-visible">
        <div class="glass-card project-card h-100">
          <div class="project-thumbnail-wrapper">
            <img src="${this.escapeHtml(imageSrc)}" alt="${this.escapeHtml(project.title)}" class="project-thumbnail-img" loading="lazy" onerror="this.src='assets/images/projects/smartbite.png'">
            <span class="project-category-pill">${this.escapeHtml(project.category || "Development")}</span>
          </div>
          <div class="project-body">
            <h4 class="project-title">${this.escapeHtml(project.title)}</h4>
            <p class="project-description">${this.escapeHtml(project.summary || project.description || "")}</p>
            <div class="project-tech-stack">
              ${tagsHtml}
            </div>
            <div class="project-footer-actions">
              <button class="btn btn-sm btn-outline-glow view-project-details-btn" data-project-id="${project.id}">
                <i class="bi bi-info-circle me-1"></i> Architecture
              </button>
              <div class="d-flex gap-2">
                ${githubBtn}
                ${demoBtn}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  openModal(projectId) {
    const data = window.portfolioStorage ? window.portfolioStorage.getData() : CONFIG.defaultData;
    const project = (data.projects || []).find(p => p.id === projectId);
    if (!project) return;

    const modalTitle = document.getElementById("projectModalTitle");
    const modalCategory = document.getElementById("projectModalCategory");
    const modalImage = document.getElementById("projectModalImage");
    const modalDescription = document.getElementById("projectModalDescription");
    const modalFeaturesList = document.getElementById("projectModalFeatures");
    const modalTechBadges = document.getElementById("projectModalTechBadges");
    const modalGithubLink = document.getElementById("projectModalGithub");
    const modalDemoLink = document.getElementById("projectModalDemo");

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalCategory) modalCategory.textContent = project.category || "Project Architecture";
    if (modalImage) {
      modalImage.src = project.image || "assets/images/projects/smartbite.png";
      modalImage.alt = project.title;
    }
    if (modalDescription) modalDescription.textContent = project.description || project.summary;

    if (modalFeaturesList) {
      const features = project.features || [project.summary];
      modalFeaturesList.innerHTML = features.map(f => `
        <li class="mb-2 d-flex align-items-start gap-2">
          <i class="bi bi-check2-circle text-info mt-1"></i>
          <span>${this.escapeHtml(f)}</span>
        </li>
      `).join("");
    }

    if (modalTechBadges) {
      modalTechBadges.innerHTML = (project.tags || []).map(t => `
        <span class="tech-badge px-2 py-1 fs-6">${this.escapeHtml(t)}</span>
      `).join("");
    }

    if (modalGithubLink) {
      if (project.github) {
        modalGithubLink.href = project.github;
        modalGithubLink.style.display = "inline-flex";
      } else {
        modalGithubLink.style.display = "none";
      }
    }

    if (modalDemoLink) {
      if (project.demo) {
        modalDemoLink.href = project.demo;
        modalDemoLink.style.display = "inline-flex";
      } else {
        modalDemoLink.style.display = "none";
      }
    }

    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Global instance
window.portfolioProjects = new PortfolioProjects();
