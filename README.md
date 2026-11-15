# Kedarling Kanade — Premium Personal Portfolio & Admin Console

A production-ready, modern, responsive, and animated personal developer portfolio website engineered for **Kedarling Kanade** — Python Developer, AI & Machine Learning Specialist, and Cloud & DevOps Engineer.

Designed with inspiration from dark developer dashboards, modern SaaS products, and Apple minimalism. Fully deployable on **Cloudflare Pages** free tier with zero server dependencies.

---

## 🚀 Live Demo & Core URLs

- **Public Portfolio**: `index.html` (Accessible at `/`)
- **Admin Console**: `admin.html` (Accessible at `/admin.html`)
  - **Default Administrator Passcode**: `admin123` (editable anytime via *Website Settings*)
  - **Supabase Cloud Login**: Integrated for persistent multi-device management.

---

## 🛠️ Technology Stack (Strict Requirements Followed)

- **Frontend**: HTML5, CSS3 (Custom Design System + CSS Variables), Vanilla JavaScript (ES6+ Modules)
- **UI Framework & Icons**: Bootstrap 5.3.3, Bootstrap Icons 1.11.3
- **Animations**: Custom GPU-accelerated Canvas Particle Constellation, CSS Keyframes, Intersection Observer Scroll Reveal, Typewriter Text Engine
- **Feedback & Alerts**: SweetAlert2 for notifications, confirmation modals, and error handling
- **Storage Layer**: Dual-mode Architecture:
  - **Local Development Mode**: `localStorage` (JSON content) + `IndexedDB` (high-capacity binary storage for PDFs, images, and resumes).
  - **Cloud Mode**: Free-tier **Supabase** (PostgreSQL + Supabase Auth + Supabase Storage).
- **Hosting**: Static build ready for **Cloudflare Pages** (100% Free Tier).

> **Strict Compliance**: No React, No Next.js, No Vue, No Angular, No Tailwind CSS, No TypeScript, and No Node.js runtime backend.

---

## 📁 Project Structure

```text
portfolio/
├── index.html                  # Public Portfolio Webpage
├── admin.html                  # Protected Admin CMS Console
├── README.md                   # Documentation & Deployment Guide
│
├── assets/
│   ├── images/
│   │   ├── profile/            # Profile portrait photograph
│   │   │   └── kedarling_profile.jpg
│   │   ├── achievements/       # Real achievement photos & certificates
│   │   │   ├── python_100_score.jpg
│   │   │   ├── invincio_runnerup_banner.jpg
│   │   │   ├── invincio_trophies.jpg
│   │   │   ├── invincio_stage_award.jpg
│   │   │   ├── faculty_recognition.jpg
│   │   │   ├── college_group_photo.jpg
│   │   │   └── medicine_plagiarism_cert.jpg
│   │   ├── certificates/       # Real certification preview images & PDFs
│   │   │   ├── suven_internship.png
│   │   │   ├── ybi_internship.png / .pdf
│   │   │   ├── simplilearn_powerbi.png / .pdf
│   │   │   ├── reliance_ai_ml.png / .pdf
│   │   │   ├── hp_life_data_science.png / .pdf
│   │   │   ├── egotech_mastery.png / .pdf
│   │   │   └── digital_fluency.png / .pdf
│   │   ├── projects/           # Architectural project banners
│   │   └── resumes/            # Resume preview thumbnails
│   └── resumes/                # Production PDF Resumes
│       ├── KedarlingKanade_Python_Developer.pdf
│       ├── KedarlingKanade_MachineLearning.pdf
│       └── KedarlingKanade_DevOps__Cloud.pdf
│
├── css/
│   ├── style.css               # Main visual design system, glassmorphism, responsive grid
│   ├── animations.css          # Keyframes, floating orbs, radar pulse, reduced-motion
│   └── admin.css               # Admin CMS console, tables, dropzones, metrics
│
└── js/
    ├── config.js               # Initial data seed, constants, categories
    ├── storage.js              # Storage abstraction (Supabase vs IndexedDB/localStorage)
    ├── auth.js                 # Session guard & auth (Supabase Auth + Passcode fallback)
    ├── animations.js           # Particle canvas, typewriter, scroll reveals, cursor glow
    ├── projects.js             # Filterable project portfolio & architecture detail modal
    ├── contact.js              # Form validation, SweetAlert2 alerts, mailto fallback
    ├── main.js                 # Main portfolio controller, theme toggle, dynamic rendering
    └── admin.js                # Complete admin CRUD engine, drag-and-drop file uploads
```

---

## 🌟 Key Features

### 1. Hero & About Me
- Availability badge with live pulsing radar dot ("Available for Opportunities").
- Animated text reveal typewriter featuring 4 rotating roles:
  - *Python Full Stack Developer*
  - *AI & Machine Learning Enthusiast*
  - *Cloud & DevOps Engineer*
  - *Generative AI Specialist*
- Real professional portrait of Kedarling Kanade with floating holographic stats:
  - **100/100** Python Exam Score
  - **9.19 SGPA** (BCA) & **8.6 CGPA** (MCA)
- Download resume, explore projects, and direct contact buttons.
- Detailed professional bio, career interests, and verified education track.

### 2. Categorized Technical Skills
- Verified skill cards with level badges (Expert, Advanced, Proficient, Hands-on):
  - **Programming**: Python, Core Java, Bash & Shell Scripting
  - **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5, React.js
  - **Backend**: Django, Django REST Framework, Flask, REST APIs
  - **AI & Machine Learning**: Supervised/Unsupervised Learning, Scikit-learn, Pandas, NumPy, OpenCV, OCR
  - **Generative AI**: LLMs, RAG, LangChain, LangGraph (Agentic Workflows), ChromaDB, Groq LLaMA 3.1, Hugging Face
  - **Cloud**: AWS (EC2, S3, IAM, Lambda, CloudWatch, VPC, Route 53, ALB, Auto Scaling, RDS), Microsoft Azure
  - **DevOps**: Docker, Kubernetes, Terraform, OpenTofu, Jenkins, CI/CD, GitHub Actions
  - **Monitoring**: Prometheus, Grafana, Splunk, CloudWatch
  - **Database**: MySQL, Oracle Database, ChromaDB
  - **Tools**: Git, GitHub, VS Code, Postman, Linux / Ubuntu, Jupyter Notebook

### 3. Experience & Internships Timeline
- **Suven Consultants & Technology Pvt. Ltd.** — Machine Learning Intern (Mar 2026 – May 2026, Remote)
  - Bitcoin transaction clustering analysis, feature engineering, AWS & Terraform DevOps.
  - Interactive modal preview for verification code `7TAHHKML`.
- **YBI Foundation** — Python & Data Science Intern (Jun 2024 – Jul 2024, Remote)
  - Regression and classification models, data cleaning with Pandas & NumPy.
  - Interactive modal preview for credential ID `WQ18O328SQELS`.

### 4. Filterable Project Portfolio
Filterable by: **All | Python | AI/ML | Generative AI | Web Development | Cloud | DevOps**
1. **SmartBite – AI Integrated Food Ordering System** (React, Django, DRF, Scikit-learn, NLP, MySQL)
2. **LangGraph Agent for Intelligent Web Information Retrieval** (LangGraph, LangChain, Groq LLaMA 3.1, Tavily API)
3. **AI Powered Document Question Answering using RAG** (LangChain, ChromaDB, Vector Embeddings)
4. **AI Powered Medicine Expiry Detection & Smart Alert System** (OpenCV, OCR, ML, IoT — 1% Plagiarism Match)
5. **AI Based Salary Prediction System** (Python, Scikit-learn, Streamlit, Flask)
6. **Terraform-Based Serverless File Upload Monitoring System** (AWS Lambda, S3, CloudWatch, Terraform, IAM)
7. **Export CloudWatch Logs to Amazon S3 using AWS Lambda** (Python, AWS Lambda, CloudWatch, S3, IAM)
8. **AWS EC2 Monitoring using Prometheus and Grafana** (AWS EC2, Ubuntu, Prometheus, Grafana, Node Exporter)
9. **AWS Three-Tier Web Application Deployment** (AWS VPC, ALB, Auto Scaling, RDS MySQL, Nginx)

Every project card features a **"View Architecture"** button opening an in-depth modal containing the system overview, key feature checklist, tech stack badges, and direct GitHub links.

### 5. Honors & Achievements Gallery
Visual lightbox gallery featuring genuine uploaded photos:
- 100/100 Python Programming University Examination Distinction
- Runner-up in State-Level Coding Event "INVINCIO-2.0" (with Aditya Kamate)
- Photograph with the Runner-up Trophies
- Grand Stage Award Presentation at KLE PCJabin Science College
- Faculty Recognition Felicitation
- GM University MCA Batch Commemoration Group Photo
- Plagiarism Clearance Certificate (1% DrillBit match score by GM University)

### 6. Resume Download Center
Three tailored resume editions:
1. **Python Developer Resume** (Full Stack & Backend)
2. **Machine Learning / AI Resume** (AI, ML & Generative AI)
3. **DevOps & Cloud Resume** (Cloud Architecture & AWS Automation)
Features one-click high-resolution PDF download (with SweetAlert2 progress alert) and an embedded in-browser PDF preview modal.

### 7. Protected Admin Dashboard (`/admin.html`)
- Manage Profile, Headline, and Availability status.
- Add, Edit, Delete, and Toggle Publish for Skills, Projects, Internships, Achievements, Certifications, and Resumes.
- Real drag-and-drop file upload with validation (PDF, JPG, PNG) and file size checks.
- Full backup export (`.json`) and one-click import restoration.

---

## ☁️ Deployment Instructions

### Deploy to Cloudflare Pages (Free Hosting)

1. **Option A: Drag-and-Drop (Direct Upload)**
   1. Log into your [Cloudflare Dashboard](https://dash.cloudflare.com/).
   2. Navigate to **Compute (Workers) > Workers & Pages > Create application > Pages > Upload assets**.
   3. Set project name (e.g. `kedarling-portfolio`).
   4. Drag and drop the `portfolio` folder (or zip contents) into the Cloudflare upload zone.
   5. Click **Deploy site**.
   6. Your website is live worldwide on a custom `*.pages.dev` subdomain with free SSL and edge caching!

2. **Option B: GitHub / GitLab Integration (Automated CI/CD)**
   1. Initialize git and push this repository to GitHub:
      ```bash
      git init
      git add .
      git commit -m "Initial release of Kedarling Kanade portfolio"
      git remote add origin https://github.com/Kedarling7838/portfolio.git
      git push -u origin main
      ```
   2. In Cloudflare Pages, select **Connect to Git**.
   3. Choose the repository and select:
      - **Framework preset**: `None`
      - **Build command**: Leave blank
      - **Build output directory**: `/` (or root)
   4. Click **Save and Deploy**. Every `git push` will automatically trigger an instant deployment.

---

## 🔒 Supabase Configuration (Optional Free Tier)

By default, the application runs in **Local Development Mode** using `localStorage` and `IndexedDB`. If you wish to enable persistent cloud storage across different devices:

1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project.
3. In **Storage**, create a new public bucket named `portfolio-assets`.
4. Copy your **Project URL** and **Public Anon Key** from **Project Settings > API**.
5. Navigate to your live portfolio's `/admin.html` > **Website Settings**.
6. Paste the Project URL and Public Anon Key, check **Enable Supabase Cloud Sync**, and click **Save Supabase Settings**.
7. Click **Test Connection** to confirm connectivity.

---

## 📄 License & Attribution

Crafted for **Kedarling Kanade** &copy; 2026. All rights reserved.
Information and media derived from official resumes, university examination records, and achievement certificates.
