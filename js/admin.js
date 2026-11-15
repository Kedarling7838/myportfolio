/**
 * Admin Dashboard Controller - Kedarling Kanade Portfolio
 * Complete CRUD engine, drag-and-drop uploads, auth guard, and Supabase / local sync
 */

let currentActiveModule = "overview";

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Storage & Auth
  await window.portfolioStorage.init();
  const user = await window.portfolioAuth.init();

  // 2. Check Auth Guard
  if (window.portfolioAuth.isAuthenticated()) {
    showAdminDashboard();
  } else {
    showLoginScreen();
  }

  // 3. Setup Auth Event Listeners
  initAuthEvents();

  // 4. Setup Mobile Sidebar & Navigation
  initSidebarNavigation();

  // 5. Setup Drag-and-drop Dropzones
  initDropzones();
});

/**
 * Show Login Screen
 */
function showLoginScreen() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("adminApp").style.display = "none";
}

/**
 * Show Admin Dashboard & Render Current Module
 */
function showAdminDashboard() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("adminApp").style.display = "flex";

  updateBackendStatusBadge();
  switchModule("overview");
  loadOverviewMetrics();
}

/**
 * Auth Form Handlers
 */
function initAuthEvents() {
  const passcodeForm = document.getElementById("passcodeLoginForm");
  const supabaseForm = document.getElementById("supabaseLoginForm");
  const logoutBtn = document.getElementById("logoutBtn");

  passcodeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const passcode = document.getElementById("adminPasscode").value;
    try {
      window.portfolioAuth.loginLocal(passcode);
      Swal.fire({
        icon: "success",
        title: "Welcome, Kedarling!",
        text: "Administrator session authenticated successfully.",
        timer: 1800,
        showConfirmButton: false,
        background: "#0d1527",
        color: "#f8fafc"
      }).then(() => showAdminDashboard());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: err.message,
        background: "#0d1527",
        color: "#f8fafc",
        confirmButtonColor: "#38bdf8"
      });
    }
  });

  supabaseForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("supabaseEmail").value;
    const password = document.getElementById("supabasePassword").value;
    try {
      await window.portfolioAuth.loginSupabase(email, password);
      Swal.fire({
        icon: "success",
        title: "Supabase Authenticated",
        text: "Cloud admin session active.",
        timer: 1800,
        showConfirmButton: false,
        background: "#0d1527",
        color: "#f8fafc"
      }).then(() => showAdminDashboard());
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Supabase Login Failed",
        text: err.message,
        background: "#0d1527",
        color: "#f8fafc",
        confirmButtonColor: "#38bdf8"
      });
    }
  });

  logoutBtn?.addEventListener("click", () => {
    Swal.fire({
      title: "Sign Out?",
      text: "Are you sure you want to exit the admin console?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Sign Out",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#0d1527",
      color: "#f8fafc"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await window.portfolioAuth.logout();
        Swal.fire({
          icon: "info",
          title: "Logged Out",
          text: "You are now logged out.",
          timer: 1500,
          showConfirmButton: false,
          background: "#0d1527",
          color: "#f8fafc"
        }).then(() => showLoginScreen());
      }
    });
  });
}

/**
 * Update Topbar Status Pill & Banner
 */
function updateBackendStatusBadge() {
  const badge = document.getElementById("backendModeBadge");
  const banner = document.getElementById("localWarningBanner");
  const isCloud = window.portfolioStorage.isCloudMode();

  if (isCloud) {
    if (badge) {
      badge.className = "backend-status-pill cloud";
      badge.innerHTML = `<span class="radar-dot" style="background: #10b981;"></span><span>Supabase Cloud Mode</span>`;
    }
    if (banner) banner.style.display = "none";
  } else {
    if (badge) {
      badge.className = "backend-status-pill local";
      badge.innerHTML = `<span class="radar-dot" style="background: #f59e0b;"></span><span>Local Mode (IndexedDB)</span>`;
    }
    if (banner) banner.style.display = "flex";
  }
}

/**
 * Sidebar Navigation & Module Switcher
 */
function initSidebarNavigation() {
  const links = document.querySelectorAll(".admin-nav-link");
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const mod = link.getAttribute("data-module");
      if (mod) switchModule(mod);
    });
  });

  const mobileToggle = document.getElementById("mobileSidebarToggle");
  const sidebar = document.getElementById("adminSidebar");
  mobileToggle?.addEventListener("click", () => {
    sidebar?.classList.toggle("show");
  });

  document.getElementById("quickBackupBtn")?.addEventListener("click", () => {
    window.portfolioStorage.exportBackup();
  });
}

window.switchModule = function(moduleName) {
  currentActiveModule = moduleName;

  // Update nav active link
  document.querySelectorAll(".admin-nav-link").forEach(l => {
    l.classList.remove("active");
    if (l.getAttribute("data-module") === moduleName) l.classList.add("active");
  });

  // Hide all sections, show target
  document.querySelectorAll(".admin-module").forEach(sec => sec.style.display = "none");
  const targetSec = document.getElementById(`mod-${moduleName}`);
  if (targetSec) targetSec.style.display = "block";

  // Update topbar title
  const titleMap = {
    overview: "Dashboard Overview",
    profile: "Edit Profile & Contact Details",
    about: "Manage About Section",
    education: "Manage Education Journey",
    skills: "Manage Technical Skills",
    internships: "Manage Internships & Experience",
    projects: "Manage Project Portfolio",
    achievements: "Manage Achievements & Photos",
    certifications: "Manage Certifications & Previews",
    resumes: "Resume Download Center",
    photo: "Profile Photograph Management",
    messages: "Visitor Inquiries & Messages",
    settings: "Website Settings & Supabase Setup"
  };
  const titleEl = document.getElementById("currentModuleTitle");
  if (titleEl) titleEl.textContent = titleMap[moduleName] || "Dashboard";

  // Close mobile sidebar
  document.getElementById("adminSidebar")?.classList.remove("show");

  // Call module loaders
  if (moduleName === "overview") loadOverviewMetrics();
  if (moduleName === "profile") loadProfileForm();
  if (moduleName === "about") loadAboutForm();
  if (moduleName === "education") loadEducationTable();
  if (moduleName === "skills") loadSkillsTable();
  if (moduleName === "internships") loadInternshipsTable();
  if (moduleName === "projects") loadProjectsTable();
  if (moduleName === "achievements") loadAchievementsTable();
  if (moduleName === "certifications") loadCertificationsTable();
  if (moduleName === "resumes") loadResumesTable();
  if (moduleName === "photo") loadPhotoModule();
  if (moduleName === "messages") loadMessagesTable();
  if (moduleName === "settings") loadSettingsModule();
};

/**
 * 1. Overview Metrics
 */
function loadOverviewMetrics() {
  const data = window.portfolioStorage.getData();
  document.getElementById("statProjectsCount").textContent = (data.projects || []).length;
  document.getElementById("statSkillsCount").textContent = (data.skills || []).length;
  document.getElementById("statCertsCount").textContent = (data.certifications || []).length;
  document.getElementById("statAchievementsCount").textContent = (data.achievements || []).length;
  document.getElementById("statResumesCount").textContent = (data.resumes || []).length;
  document.getElementById("statMessagesCount").textContent = (data.messages || []).length;
}

/**
 * 2. Profile Module
 */
function loadProfileForm() {
  const data = window.portfolioStorage.getData();
  const p = data.profile || {};

  document.getElementById("profName").value = p.name || "";
  document.getElementById("profHeadline").value = p.headline || "";
  document.getElementById("profAvailability").value = p.availability || "";
  document.getElementById("profRoles").value = (p.roles || []).join(", ");
  document.getElementById("profEmail").value = p.email || "";
  document.getElementById("profPhone").value = p.phone || "";
  document.getElementById("profLocation").value = p.location || "";
  document.getElementById("profGithub").value = p.github || "";
  document.getElementById("profLinkedin").value = p.linkedin || "";

  const form = document.getElementById("profileForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    p.name = document.getElementById("profName").value.trim();
    p.headline = document.getElementById("profHeadline").value.trim();
    p.availability = document.getElementById("profAvailability").value.trim();
    p.roles = document.getElementById("profRoles").value.split(",").map(r => r.trim()).filter(Boolean);
    p.email = document.getElementById("profEmail").value.trim();
    p.phone = document.getElementById("profPhone").value.trim();
    p.location = document.getElementById("profLocation").value.trim();
    p.github = document.getElementById("profGithub").value.trim();
    p.linkedin = document.getElementById("profLinkedin").value.trim();

    data.profile = p;
    window.portfolioStorage.saveData(data);

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Profile details updated successfully.",
      background: "#0d1527",
      color: "#f8fafc",
      confirmButtonColor: "#38bdf8"
    });
  };
}

/**
 * 3. About Module
 */
function loadAboutForm() {
  const data = window.portfolioStorage.getData();
  const a = data.about || {};

  document.getElementById("aboutBioInput").value = a.bio || "";
  document.getElementById("aboutInterestsInput").value = a.careerInterests || "";
  document.getElementById("aboutGoalsInput").value = a.professionalGoals || "";

  const form = document.getElementById("aboutForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    a.bio = document.getElementById("aboutBioInput").value.trim();
    a.careerInterests = document.getElementById("aboutInterestsInput").value.trim();
    a.professionalGoals = document.getElementById("aboutGoalsInput").value.trim();

    data.about = a;
    window.portfolioStorage.saveData(data);

    Swal.fire({
      icon: "success",
      title: "About Saved",
      text: "About section details updated successfully.",
      background: "#0d1527",
      color: "#f8fafc",
      confirmButtonColor: "#38bdf8"
    });
  };
}

/**
 * 4. Education Module
 */
function loadEducationTable() {
  const data = window.portfolioStorage.getData();
  const list = data.education || [];
  const tbody = document.getElementById("educationTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="fw-bold text-white">${escapeHtml(item.degree)}</td>
      <td class="text-info">${escapeHtml(item.institution)}</td>
      <td>${escapeHtml(item.duration)}</td>
      <td><span class="badge bg-success bg-opacity-25 text-success">${escapeHtml(item.score)}</span></td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1" onclick="togglePublish('education', '${item.id}')" title="Toggle Visibility">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('education', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openEducationModal = function() {
  document.getElementById("eduModalId").value = "";
  document.getElementById("eduModalDegree").value = "";
  document.getElementById("eduModalScore").value = "";
  document.getElementById("eduModalInstitution").value = "";
  document.getElementById("eduModalLocation").value = "";
  document.getElementById("eduModalDuration").value = "";
  document.getElementById("eduModalDescription").value = "";
  document.getElementById("eduModalTitle").textContent = "Add Education Record";

  const modal = new bootstrap.Modal(document.getElementById("educationEditModal"));
  modal.show();
};

document.getElementById("educationModalForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("eduModalId").value;
  const item = {
    id: id || `edu-${Date.now()}`,
    degree: document.getElementById("eduModalDegree").value.trim(),
    score: document.getElementById("eduModalScore").value.trim(),
    institution: document.getElementById("eduModalInstitution").value.trim(),
    location: document.getElementById("eduModalLocation").value.trim(),
    duration: document.getElementById("eduModalDuration").value.trim(),
    description: document.getElementById("eduModalDescription").value.trim(),
    isPublished: true
  };

  window.portfolioStorage.saveItem("education", item);
  bootstrap.Modal.getInstance(document.getElementById("educationEditModal"))?.hide();
  loadEducationTable();
  Swal.fire({
    icon: "success",
    title: "Education Saved",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
});

/**
 * 5. Skills Module
 */
function loadSkillsTable() {
  const data = window.portfolioStorage.getData();
  const list = data.skills || [];
  const tbody = document.getElementById("skillsTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="fw-bold text-white"><i class="bi ${escapeHtml(item.icon || 'bi-cpu')} text-info me-2"></i> ${escapeHtml(item.name)}</td>
      <td><span class="badge bg-secondary">${escapeHtml(item.category)}</span></td>
      <td><span class="badge bg-primary bg-opacity-25 text-info">${escapeHtml(item.level || 'Proficient')}</span></td>
      <td><code>${escapeHtml(item.icon || 'bi-circle')}</code></td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1" onclick="editSkill('${item.id}')" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('skills', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openSkillModal = function() {
  document.getElementById("skillModalId").value = "";
  document.getElementById("skillModalName").value = "";
  document.getElementById("skillModalCategory").value = "Programming";
  document.getElementById("skillModalLevel").value = "Advanced";
  document.getElementById("skillModalIcon").value = "bi-terminal";
  document.getElementById("skillModalTitle").textContent = "Add Technical Skill";

  const modal = new bootstrap.Modal(document.getElementById("skillEditModal"));
  modal.show();
};

window.editSkill = function(id) {
  const data = window.portfolioStorage.getData();
  const item = (data.skills || []).find(s => s.id === id);
  if (!item) return;

  document.getElementById("skillModalId").value = item.id;
  document.getElementById("skillModalName").value = item.name;
  document.getElementById("skillModalCategory").value = item.category;
  document.getElementById("skillModalLevel").value = item.level || "Proficient";
  document.getElementById("skillModalIcon").value = item.icon || "bi-cpu";
  document.getElementById("skillModalTitle").textContent = "Edit Technical Skill";

  const modal = new bootstrap.Modal(document.getElementById("skillEditModal"));
  modal.show();
};

document.getElementById("skillModalForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("skillModalId").value;
  const item = {
    id: id || `sk-${Date.now()}`,
    name: document.getElementById("skillModalName").value.trim(),
    category: document.getElementById("skillModalCategory").value,
    level: document.getElementById("skillModalLevel").value,
    icon: document.getElementById("skillModalIcon").value.trim() || "bi-check-circle",
    isPublished: true
  };

  window.portfolioStorage.saveItem("skills", item);
  bootstrap.Modal.getInstance(document.getElementById("skillEditModal"))?.hide();
  loadSkillsTable();
  Swal.fire({
    icon: "success",
    title: "Skill Saved",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
});

/**
 * 6. Internships Module
 */
function loadInternshipsTable() {
  const data = window.portfolioStorage.getData();
  const list = data.internships || [];
  const tbody = document.getElementById("internshipsTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="fw-bold text-white">${escapeHtml(item.role)}</td>
      <td class="text-info">${escapeHtml(item.company)}</td>
      <td>${escapeHtml(item.duration)}</td>
      <td>
        ${item.certificateImage ? `<a href="${item.certificateImage}" target="_blank" class="badge bg-info text-dark text-decoration-none"><i class="bi bi-file-earmark-image"></i> View Cert</a>` : '<span class="text-muted small">None</span>'}
      </td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1" onclick="togglePublish('internships', '${item.id}')" title="Toggle Visibility">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('internships', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openInternshipModal = function() {
  document.getElementById("internModalId").value = "";
  document.getElementById("internModalRole").value = "";
  document.getElementById("internModalCompany").value = "";
  document.getElementById("internModalDuration").value = "";
  document.getElementById("internModalMode").value = "Remote";
  document.getElementById("internModalCode").value = "";
  document.getElementById("internModalResponsibilities").value = "";
  document.getElementById("internModalCertImage").value = "";
  document.getElementById("internModalTitle").textContent = "Add Internship / Experience";

  const modal = new bootstrap.Modal(document.getElementById("internshipEditModal"));
  modal.show();
};

document.getElementById("internshipModalForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("internModalId").value;
  const item = {
    id: id || `exp-${Date.now()}`,
    role: document.getElementById("internModalRole").value.trim(),
    company: document.getElementById("internModalCompany").value.trim(),
    duration: document.getElementById("internModalDuration").value.trim(),
    mode: document.getElementById("internModalMode").value.trim() || "Remote",
    certificateCode: document.getElementById("internModalCode").value.trim(),
    responsibilities: document.getElementById("internModalResponsibilities").value.split("\n").map(r => r.trim()).filter(Boolean),
    certificateImage: document.getElementById("internModalCertImage").value || "assets/images/certificates/suven_internship.png",
    isPublished: true
  };

  window.portfolioStorage.saveItem("internships", item);
  bootstrap.Modal.getInstance(document.getElementById("internshipEditModal"))?.hide();
  loadInternshipsTable();
  Swal.fire({
    icon: "success",
    title: "Internship Saved",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
});

/**
 * 7. Projects Module
 */
function loadProjectsTable() {
  const data = window.portfolioStorage.getData();
  const list = data.projects || [];
  const tbody = document.getElementById("projectsTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td style="width: 80px;">
        <img src="${escapeHtml(item.image || 'assets/images/projects/smartbite.png')}" alt="" class="rounded border border-secondary border-opacity-25" style="width: 60px; height: 38px; object-fit: cover;">
      </td>
      <td class="fw-bold text-white">${escapeHtml(item.title)}</td>
      <td><span class="badge bg-secondary">${escapeHtml(item.category || 'General')}</span></td>
      <td>
        ${(item.tags || []).slice(0, 3).map(t => `<span class="tech-badge">${escapeHtml(t)}</span>`).join(" ")}
      </td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-info me-1" onclick="editProject('${item.id}')" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="togglePublish('projects', '${item.id}')" title="Toggle Visibility">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('projects', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openProjectModal = function() {
  document.getElementById("projModalId").value = "";
  document.getElementById("projModalTitle").value = "";
  document.getElementById("projModalCategory").value = "Web Development";
  document.getElementById("projModalSummary").value = "";
  document.getElementById("projModalDescription").value = "";
  document.getElementById("projModalFeatures").value = "";
  document.getElementById("projModalTags").value = "";
  document.getElementById("projModalGithub").value = "";
  document.getElementById("projModalDemo").value = "";
  document.getElementById("projModalImage").value = "assets/images/projects/smartbite.png";
  document.getElementById("projectEditModalTitle").textContent = "Add New Project";

  const modal = new bootstrap.Modal(document.getElementById("projectEditModal"));
  modal.show();
};

window.editProject = function(id) {
  const data = window.portfolioStorage.getData();
  const p = (data.projects || []).find(x => x.id === id);
  if (!p) return;

  document.getElementById("projModalId").value = p.id;
  document.getElementById("projModalTitle").value = p.title;
  document.getElementById("projModalCategory").value = p.category || "Web Development";
  document.getElementById("projModalSummary").value = p.summary || "";
  document.getElementById("projModalDescription").value = p.description || "";
  document.getElementById("projModalFeatures").value = (p.features || []).join("\n");
  document.getElementById("projModalTags").value = (p.tags || []).join(", ");
  document.getElementById("projModalGithub").value = p.github || "";
  document.getElementById("projModalDemo").value = p.demo || "";
  document.getElementById("projModalImage").value = p.image || "assets/images/projects/smartbite.png";
  document.getElementById("projectEditModalTitle").textContent = "Edit Project";

  const modal = new bootstrap.Modal(document.getElementById("projectEditModal"));
  modal.show();
};

document.getElementById("projectEditForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("projModalId").value;
  const project = {
    id: id || `proj-${Date.now()}`,
    title: document.getElementById("projModalTitle").value.trim(),
    category: document.getElementById("projModalCategory").value,
    summary: document.getElementById("projModalSummary").value.trim(),
    description: document.getElementById("projModalDescription").value.trim(),
    features: document.getElementById("projModalFeatures").value.split("\n").map(f => f.trim()).filter(Boolean),
    tags: document.getElementById("projModalTags").value.split(",").map(t => t.trim()).filter(Boolean),
    github: document.getElementById("projModalGithub").value.trim(),
    demo: document.getElementById("projModalDemo").value.trim(),
    image: document.getElementById("projModalImage").value || "assets/images/projects/smartbite.png",
    isPublished: true
  };

  window.portfolioStorage.saveItem("projects", project);
  bootstrap.Modal.getInstance(document.getElementById("projectEditModal"))?.hide();
  loadProjectsTable();
  Swal.fire({
    icon: "success",
    title: "Project Saved",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
});

/**
 * 8. Achievements Module
 */
function loadAchievementsTable() {
  const data = window.portfolioStorage.getData();
  const list = data.achievements || [];
  const tbody = document.getElementById("achievementsTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td style="width: 80px;">
        <img src="${escapeHtml(item.image)}" alt="" class="rounded border border-secondary border-opacity-25" style="width: 60px; height: 45px; object-fit: cover;">
      </td>
      <td class="fw-bold text-white">${escapeHtml(item.title)}</td>
      <td class="text-info">${escapeHtml(item.organization)}</td>
      <td><span class="badge bg-secondary">${escapeHtml(item.category || 'Honor')}</span></td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="togglePublish('achievements', '${item.id}')" title="Toggle Visibility">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('achievements', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openAchievementModal = function() {
  document.getElementById("achModalId").value = "";
  document.getElementById("achModalName").value = "";
  document.getElementById("achModalCategory").value = "Award & Honor";
  document.getElementById("achModalOrg").value = "";
  document.getElementById("achModalDate").value = "";
  document.getElementById("achModalDesc").value = "";
  document.getElementById("achModalImage").value = "";
  document.getElementById("achModalTitle").textContent = "Add Achievement Photograph";

  const modal = new bootstrap.Modal(document.getElementById("achievementEditModal"));
  modal.show();
};

document.getElementById("achievementModalForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("achModalId").value;
  const image = document.getElementById("achModalImage").value;

  if (!image) {
    Swal.fire({
      icon: "warning",
      title: "Photograph Required",
      text: "Please upload or select an achievement photograph.",
      background: "#0d1527",
      color: "#f8fafc",
      confirmButtonColor: "#38bdf8"
    });
    return;
  }

  const achievement = {
    id: id || `ach-${Date.now()}`,
    title: document.getElementById("achModalName").value.trim(),
    category: document.getElementById("achModalCategory").value.trim(),
    organization: document.getElementById("achModalOrg").value.trim(),
    date: document.getElementById("achModalDate").value.trim(),
    description: document.getElementById("achModalDesc").value.trim(),
    image: image,
    isPublished: true
  };

  window.portfolioStorage.saveItem("achievements", achievement);
  bootstrap.Modal.getInstance(document.getElementById("achievementEditModal"))?.hide();
  loadAchievementsTable();
  Swal.fire({
    icon: "success",
    title: "Achievement Added",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
});

/**
 * 9. Certifications Module
 */
function loadCertificationsTable() {
  const data = window.portfolioStorage.getData();
  const list = data.certifications || [];
  const tbody = document.getElementById("certsTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td style="width: 80px;">
        <img src="${escapeHtml(item.image)}" alt="" class="rounded border border-secondary border-opacity-25" style="width: 60px; height: 42px; object-fit: cover;">
      </td>
      <td class="fw-bold text-white">${escapeHtml(item.title)}</td>
      <td class="text-info">${escapeHtml(item.issuer)}</td>
      <td>${escapeHtml(item.date || '')}</td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <button class="btn btn-sm btn-outline-warning me-1" onclick="togglePublish('certifications', '${item.id}')" title="Toggle Visibility">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('certifications', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openCertModal = function() {
  document.getElementById("certModalId").value = "";
  document.getElementById("certModalTitleInput").value = "";
  document.getElementById("certModalIssuer").value = "";
  document.getElementById("certModalDate").value = "";
  document.getElementById("certModalCredId").value = "";
  document.getElementById("certModalSkills").value = "";
  document.getElementById("certModalImage").value = "";
  document.getElementById("certModalPdf").value = "";
  document.getElementById("certEditModalTitle").textContent = "Add Certification";

  const modal = new bootstrap.Modal(document.getElementById("certEditModal"));
  modal.show();
};

document.getElementById("certEditForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("certModalId").value;
  const image = document.getElementById("certModalImage").value || "assets/images/certificates/reliance_ai_ml.png";

  const cert = {
    id: id || `cert-${Date.now()}`,
    title: document.getElementById("certModalTitleInput").value.trim(),
    issuer: document.getElementById("certModalIssuer").value.trim(),
    date: document.getElementById("certModalDate").value.trim(),
    credentialId: document.getElementById("certModalCredId").value.trim(),
    skills: document.getElementById("certModalSkills").value.split(",").map(s => s.trim()).filter(Boolean),
    image: image,
    pdf: document.getElementById("certModalPdf").value,
    isPublished: true
  };

  window.portfolioStorage.saveItem("certifications", cert);
  bootstrap.Modal.getInstance(document.getElementById("certEditModal"))?.hide();
  loadCertificationsTable();
  Swal.fire({
    icon: "success",
    title: "Certificate Saved",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
});

/**
 * 10. Resumes Module
 */
function loadResumesTable() {
  const data = window.portfolioStorage.getData();
  const list = data.resumes || [];
  const tbody = document.getElementById("resumesTableBody");
  if (!tbody) return;

  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="fw-bold text-white">${escapeHtml(item.title)}</td>
      <td><span class="badge bg-secondary">${escapeHtml(item.version || 'v2026')}</span></td>
      <td><span class="badge bg-primary bg-opacity-25 text-info">${escapeHtml(item.category || 'General')}</span></td>
      <td>
        ${item.isDefault ? '<span class="badge bg-success"><i class="bi bi-star-fill me-1"></i> Default</span>' : `<button class="btn btn-sm btn-outline-secondary" onclick="setDefaultResume('${item.id}')">Set Default</button>`}
      </td>
      <td>
        <span class="badge ${item.isPublished !== false ? 'bg-success' : 'bg-secondary'}">${item.isPublished !== false ? 'Published' : 'Hidden'}</span>
      </td>
      <td>
        <a href="${escapeHtml(item.pdfUrl)}" target="_blank" class="btn btn-sm btn-outline-info me-1" title="View PDF">
          <i class="bi bi-file-earmark-pdf"></i>
        </a>
        <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('resumes', '${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.openResumeUploadModal = function() {
  document.getElementById("resumeModalId").value = "";
  document.getElementById("resumeModalTitleInput").value = "";
  document.getElementById("resumeModalCategory").value = "";
  document.getElementById("resumeModalVersion").value = "v2026.1";
  document.getElementById("resumeModalDesc").value = "";
  document.getElementById("resumeModalIsDefault").checked = false;
  document.getElementById("resumeModalPdfUrl").value = "";

  const modal = new bootstrap.Modal(document.getElementById("resumeEditModal"));
  modal.show();
};

window.setDefaultResume = function(id) {
  const data = window.portfolioStorage.getData();
  data.resumes = (data.resumes || []).map(r => ({
    ...r,
    isDefault: (r.id === id)
  }));
  window.portfolioStorage.saveData(data);
  loadResumesTable();
  Swal.fire({
    icon: "success",
    title: "Default Resume Updated",
    timer: 1500,
    showConfirmButton: false,
    background: "#0d1527",
    color: "#f8fafc"
  });
};

document.getElementById("resumeEditForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("resumeModalId").value;
  const pdfUrl = document.getElementById("resumeModalPdfUrl").value;

  if (!pdfUrl) {
    Swal.fire({
      icon: "warning",
      title: "PDF File Required",
      text: "Please upload a valid PDF resume document.",
      background: "#0d1527",
      color: "#f8fafc",
      confirmButtonColor: "#38bdf8"
    });
    return;
  }

  const isDefault = document.getElementById("resumeModalIsDefault").checked;
  const data = window.portfolioStorage.getData();

  if (isDefault) {
    data.resumes = (data.resumes || []).map(r => ({ ...r, isDefault: false }));
  }

  const resume = {
    id: id || `res-${Date.now()}`,
    title: document.getElementById("resumeModalTitleInput").value.trim(),
    category: document.getElementById("resumeModalCategory").value.trim(),
    version: document.getElementById("resumeModalVersion").value.trim(),
    description: document.getElementById("resumeModalDesc").value.trim(),
    pdfUrl: pdfUrl,
    previewImage: "assets/images/resumes/resume_python.png",
    isDefault: isDefault,
    isPublished: true
  };

  data.resumes = data.resumes || [];
  const idx = data.resumes.findIndex(r => r.id === resume.id);
  if (idx >= 0) {
    data.resumes[idx] = resume;
  } else {
    data.resumes.unshift(resume);
  }

  window.portfolioStorage.saveData(data);
  bootstrap.Modal.getInstance(document.getElementById("resumeEditModal"))?.hide();
  loadResumesTable();
  Swal.fire({
    icon: "success",
    title: "Resume Published",
    text: "Updated resume version is now available for visitors to preview and download.",
    background: "#0d1527",
    color: "#f8fafc",
    confirmButtonColor: "#38bdf8"
  });
});

/**
 * 11. Profile Photo Module
 */
function loadPhotoModule() {
  const data = window.portfolioStorage.getData();
  const img = document.getElementById("adminProfilePreview");
  if (img && data.profile && data.profile.photoUrl) {
    img.src = data.profile.photoUrl;
  }
}

/**
 * 12. Messages Module
 */
function loadMessagesTable() {
  const data = window.portfolioStorage.getData();
  const list = data.messages || [];
  const tbody = document.getElementById("messagesTableBody");
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No visitor inquiries logged yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(item => `
    <tr>
      <td class="fw-bold text-white">${escapeHtml(item.name)}</td>
      <td><a href="mailto:${escapeHtml(item.email)}" class="text-info">${escapeHtml(item.email)}</a></td>
      <td class="fw-semibold">${escapeHtml(item.subject)}</td>
      <td class="text-muted small">${escapeHtml(item.message)}</td>
      <td class="small text-muted">${new Date(item.submittedAt).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage('${item.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");
}

window.deleteMessage = function(id) {
  const data = window.portfolioStorage.getData();
  data.messages = (data.messages || []).filter(m => m.id !== id);
  window.portfolioStorage.saveData(data);
  loadMessagesTable();
};

window.clearAllMessages = function() {
  Swal.fire({
    title: "Clear all messages?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Clear All",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    background: "#0d1527",
    color: "#f8fafc"
  }).then((res) => {
    if (res.isConfirmed) {
      const data = window.portfolioStorage.getData();
      data.messages = [];
      window.portfolioStorage.saveData(data);
      loadMessagesTable();
      Swal.fire({
        icon: "success",
        title: "Cleared",
        text: "All inquiries deleted.",
        timer: 1500,
        showConfirmButton: false,
        background: "#0d1527",
        color: "#f8fafc"
      });
    }
  });
};

/**
 * 13. Settings & Supabase
 */
function loadSettingsModule() {
  const cfg = window.portfolioStorage.getSupabaseConfig();
  document.getElementById("sbUrl").value = cfg.url || "";
  document.getElementById("sbAnonKey").value = cfg.anonKey || "";
  document.getElementById("sbEnabled").checked = !!cfg.enabled;

  const form = document.getElementById("supabaseConfigForm");
  form.onsubmit = (e) => {
    e.preventDefault();
    const newCfg = {
      url: document.getElementById("sbUrl").value.trim(),
      anonKey: document.getElementById("sbAnonKey").value.trim(),
      enabled: document.getElementById("sbEnabled").checked
    };

    window.portfolioStorage.saveSupabaseConfig(newCfg);
    updateBackendStatusBadge();

    Swal.fire({
      icon: "success",
      title: "Settings Saved",
      text: "Supabase configuration updated.",
      background: "#0d1527",
      color: "#f8fafc",
      confirmButtonColor: "#38bdf8"
    });
  };

  document.getElementById("testSupabaseBtn").onclick = async () => {
    const url = document.getElementById("sbUrl").value.trim();
    const key = document.getElementById("sbAnonKey").value.trim();

    if (!url || !key) {
      Swal.fire({
        icon: "warning",
        title: "Missing Credentials",
        text: "Please enter both the Supabase URL and Anon Key.",
        background: "#0d1527",
        color: "#f8fafc",
        confirmButtonColor: "#38bdf8"
      });
      return;
    }

    try {
      const client = window.supabase.createClient(url, key);
      const { data, error } = await client.auth.getSession();
      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Connection Successful!",
        text: "Your Supabase project is active and reachable.",
        background: "#0d1527",
        color: "#f8fafc",
        confirmButtonColor: "#38bdf8"
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Connection Failed",
        text: err.message,
        background: "#0d1527",
        color: "#f8fafc",
        confirmButtonColor: "#38bdf8"
      });
    }
  };

  // Passcode update form
  const passcodeForm = document.getElementById("passcodeUpdateForm");
  passcodeForm.onsubmit = (e) => {
    e.preventDefault();
    const newPasscode = document.getElementById("newAdminPasscode").value.trim();
    if (newPasscode.length < 4) {
      Swal.fire({
        icon: "warning",
        title: "Passcode Too Short",
        text: "Passcode should be at least 4 characters.",
        background: "#0d1527",
        color: "#f8fafc",
        confirmButtonColor: "#38bdf8"
      });
      return;
    }

    const data = window.portfolioStorage.getData();
    data.settings = data.settings || {};
    data.settings.adminPasscodeHash = newPasscode;
    window.portfolioStorage.saveData(data);

    Swal.fire({
      icon: "success",
      title: "Passcode Updated",
      text: "Admin passcode changed successfully.",
      background: "#0d1527",
      color: "#f8fafc",
      confirmButtonColor: "#38bdf8"
    });
    passcodeForm.reset();
  };

  // Import backup handler
  document.getElementById("importBackupInput").onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = window.portfolioStorage.importBackup(event.target.result);
      if (success) {
        Swal.fire({
          icon: "success",
          title: "Backup Restored",
          text: "Portfolio data restored from file successfully.",
          background: "#0d1527",
          color: "#f8fafc",
          confirmButtonColor: "#38bdf8"
        }).then(() => location.reload());
      } else {
        Swal.fire({
          icon: "error",
          title: "Import Error",
          text: "The selected file is not a valid portfolio backup JSON.",
          background: "#0d1527",
          color: "#f8fafc",
          confirmButtonColor: "#38bdf8"
        });
      }
    };
    reader.readAsText(file);
  };
}

/**
 * Universal Helpers: Delete, Toggle Publish, Reset
 */
window.confirmDelete = function(collectionName, itemId) {
  Swal.fire({
    title: "Are you sure?",
    text: `Do you really want to delete this ${collectionName.slice(0, -1)} item?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    background: "#0d1527",
    color: "#f8fafc"
  }).then((result) => {
    if (result.isConfirmed) {
      window.portfolioStorage.deleteItem(collectionName, itemId);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Item removed successfully.",
        timer: 1500,
        showConfirmButton: false,
        background: "#0d1527",
        color: "#f8fafc"
      });
      // Refresh current table
      switchModule(currentActiveModule);
    }
  });
};

window.togglePublish = function(collectionName, itemId) {
  const data = window.portfolioStorage.getData();
  const list = data[collectionName] || [];
  const item = list.find(x => x.id === itemId);
  if (item) {
    item.isPublished = !(item.isPublished !== false);
    window.portfolioStorage.saveData(data);
    switchModule(currentActiveModule);
  }
};

window.confirmResetDefaults = function() {
  Swal.fire({
    title: "Reset to Default Seed Data?",
    text: "This will revert your portfolio content to the original verified resume details and photographs.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Reset All",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    background: "#0d1527",
    color: "#f8fafc"
  }).then((res) => {
    if (res.isConfirmed) {
      window.portfolioStorage.resetToDefaults();
      Swal.fire({
        icon: "success",
        title: "Reset Completed",
        text: "Default seed data restored.",
        timer: 1500,
        showConfirmButton: false,
        background: "#0d1527",
        color: "#f8fafc"
      }).then(() => location.reload());
    }
  });
};

/**
 * Drag and Drop Dropzone Attachments
 */
function initDropzones() {
  setupDropzone("profileDropzone", "profileFileInput", async (file) => {
    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please upload an image file (JPG, PNG, WEBP).", background: "#0d1527", color: "#f8fafc" });
      return;
    }
    const uploaded = await window.portfolioStorage.uploadFile(file, "profile");
    const data = window.portfolioStorage.getData();
    data.profile.photoUrl = uploaded.url;
    window.portfolioStorage.saveData(data);
    loadPhotoModule();
    Swal.fire({ icon: "success", title: "Photo Updated", text: "Profile photograph replaced successfully.", background: "#0d1527", color: "#f8fafc" });
  });

  setupDropzone("projectDropzone", "projFileInput", async (file) => {
    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please upload an image file (JPG, PNG, WEBP).", background: "#0d1527", color: "#f8fafc" });
      return;
    }
    const uploaded = await window.portfolioStorage.uploadFile(file, "projects");
    document.getElementById("projModalImage").value = uploaded.url;
    Swal.fire({ icon: "success", title: "Graphic Uploaded", text: file.name, timer: 1500, showConfirmButton: false, background: "#0d1527", color: "#f8fafc" });
  });

  setupDropzone("achievementDropzone", "achFileInput", async (file) => {
    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please upload an image file (JPG, PNG, WEBP).", background: "#0d1527", color: "#f8fafc" });
      return;
    }
    const uploaded = await window.portfolioStorage.uploadFile(file, "achievements");
    document.getElementById("achModalImage").value = uploaded.url;
    Swal.fire({ icon: "success", title: "Photo Uploaded", text: file.name, timer: 1500, showConfirmButton: false, background: "#0d1527", color: "#f8fafc" });
  });

  setupDropzone("internshipDropzone", "internFileInput", async (file) => {
    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please upload an image file (JPG, PNG, WEBP).", background: "#0d1527", color: "#f8fafc" });
      return;
    }
    const uploaded = await window.portfolioStorage.uploadFile(file, "internships");
    document.getElementById("internModalCertImage").value = uploaded.url;
    Swal.fire({ icon: "success", title: "Certificate Uploaded", text: file.name, timer: 1500, showConfirmButton: false, background: "#0d1527", color: "#f8fafc" });
  });

  setupDropzone("certDropzone", "certFileInput", async (file) => {
    const isImg = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";
    if (!isImg && !isPdf) {
      Swal.fire({ icon: "error", title: "Invalid File", text: "Please upload a valid image or PDF certificate.", background: "#0d1527", color: "#f8fafc" });
      return;
    }
    const uploaded = await window.portfolioStorage.uploadFile(file, "certificates");
    if (isImg) {
      document.getElementById("certModalImage").value = uploaded.url;
    } else {
      document.getElementById("certModalPdf").value = uploaded.url;
      document.getElementById("certModalImage").value = "assets/images/certificates/reliance_ai_ml.png"; // Fallback preview
    }
    Swal.fire({ icon: "success", title: "Certificate Uploaded", text: file.name, timer: 1500, showConfirmButton: false, background: "#0d1527", color: "#f8fafc" });
  });

  setupDropzone("resumeDropzone", "resumeFileInput", async (file) => {
    if (file.type !== "application/pdf") {
      Swal.fire({ icon: "error", title: "PDF Required", text: "Please upload a valid PDF file for the resume.", background: "#0d1527", color: "#f8fafc" });
      return;
    }
    const uploaded = await window.portfolioStorage.uploadFile(file, "resumes");
    document.getElementById("resumeModalPdfUrl").value = uploaded.url;
    Swal.fire({ icon: "success", title: "Resume PDF Uploaded", text: file.name, timer: 1500, showConfirmButton: false, background: "#0d1527", color: "#f8fafc" });
  });
}

function setupDropzone(dropzoneId, inputId, onFileLoaded) {
  const dropzone = document.getElementById(dropzoneId);
  const input = document.getElementById(inputId);
  if (!dropzone || !input) return;

  dropzone.addEventListener("click", () => input.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files.length) {
      onFileLoaded(e.dataTransfer.files[0]);
    }
  });

  input.addEventListener("change", (e) => {
    if (e.target.files.length) {
      onFileLoaded(e.target.files[0]);
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
