/**
 * Kedarling Kanade - Portfolio Configuration & Initial Data Seed
 * Master data store with fallback for local and Supabase modes.
 */

const CONFIG = {
  appName: "Kedarling Kanade Portfolio",
  version: "1.0.0",
  storageKey: "kedarling_portfolio_data_v1",
  authKey: "kedarling_admin_auth_v1",
  supabaseConfigKey: "kedarling_supabase_cfg_v1",
  
  // Default Supabase settings (Users can enter their keys via Admin -> Website Settings)
  supabase: {
    url: "",
    anonKey: "",
    enabled: false
  },

  // Initial Seed Portfolio Data
  defaultData: {
    profile: {
      name: "Kedarling Kanade",
      headline: "Python Developer | AI & Machine Learning | Cloud & DevOps Engineer",
      roles: [
        "Python Full Stack Developer",
        "AI & Machine Learning Enthusiast",
        "Cloud & DevOps Engineer",
        "Generative AI Specialist"
      ],
      email: "kedarkanade9417@gmail.com",
      phone: "+91 76195 77838",
      location: "Chikodi, Belagavi, Karnataka",
      github: "https://github.com/Kedarling7838",
      linkedin: "https://www.linkedin.com/in/kedarling-kanade-7070b2232",
      availability: "Available for Opportunities",
      availabilityStatus: "active", // active, busy, open
      photoUrl: "assets/images/profile/kedarling_profile.jpg",
      yearsExperience: "MCA Candidate",
      projectsCompleted: "10+",
      certificationsCount: "7+",
      pythonScore: "100/100"
    },

    about: {
      bio: "I am an MCA graduate with a strong interest in Python development, Artificial Intelligence, Machine Learning, Cloud Computing and DevOps. I enjoy building practical software applications, intelligent automation solutions and cloud-based systems. Through academic projects, internships and independent development, I have gained hands-on experience with Python, web development, AI technologies, AWS and DevOps tools. I continuously explore new technologies and enjoy solving real-world technical problems.",
      highlights: [
        {
          title: "Full-Stack Python Craftsmanship",
          description: "Building responsive, secure and high-performance web applications with Django, Django REST Framework, Flask, and React.js."
        },
        {
          title: "Intelligent AI & Machine Learning Systems",
          description: "Designing end-to-end ML pipelines, Scikit-learn models, Computer Vision OCR solutions, and LLM-powered RAG agents with LangGraph and ChromaDB."
        },
        {
          title: "Cloud Infrastructure & DevOps Automation",
          description: "Architecting resilient multi-tier AWS environments, serverless Lambda workflows, automated CI/CD pipelines, Dockerized containers, and Terraform IaC."
        },
        {
          title: "Academic & Competitive Distinction",
          description: "Scored 100/100 in Python University Examination and secured Runner-up in the state-level INVINCIO-2.0 Coding Hackathon."
        }
      ],
      careerInterests: "Python Development, AI/ML Engineering, Cloud Architecture, DevOps & Infrastructure as Code",
      professionalGoals: "To engineer scalable, resilient, and intelligent software systems that solve real-world industry problems while championing clean code and DevOps best practices.",
      resumeDownloadUrl: "assets/resumes/KedarlingKanade_Python_Developer.pdf"
    },

    education: [
      {
        id: "edu-1",
        degree: "Master of Computer Applications (MCA)",
        institution: "GM University",
        location: "Davanagere, Karnataka",
        duration: "2024 – 2026",
        score: "CGPA: 8.6",
        description: "Specializing in Advanced Software Engineering, Cloud Computing, Machine Learning, and Enterprise System Design. Completed high-impact projects including the IoT Medicine Expiry Detection System.",
        isPublished: true
      },
      {
        id: "edu-2",
        degree: "Bachelor of Computer Applications (BCA)",
        institution: "Rani Chennamma University (KLE CCAC)",
        location: "Chikodi, Belagavi, Karnataka",
        duration: "2021 – 2024",
        score: "SGPA: 9.19",
        description: "Secured university-level distinction with a perfect 100/100 score in Python Programming. Represented the institution in coding competitions, winning Runner-up in INVINCIO-2.0.",
        isPublished: true
      }
    ],

    skills: [
      // Programming
      { id: "sk-1", name: "Python", category: "Programming", level: "Expert", icon: "bi-filetype-py", isPublished: true },
      { id: "sk-2", name: "Core Java", category: "Programming", level: "Proficient", icon: "bi-filetype-java", isPublished: true },
      { id: "sk-3", name: "Bash & Shell Scripting", category: "Programming", level: "Advanced", icon: "bi-terminal", isPublished: true },
      
      // Frontend
      { id: "sk-4", name: "HTML5 & CSS3", category: "Frontend", level: "Expert", icon: "bi-filetype-html", isPublished: true },
      { id: "sk-5", name: "JavaScript (ES6+)", category: "Frontend", level: "Advanced", icon: "bi-filetype-js", isPublished: true },
      { id: "sk-6", name: "Bootstrap 5", category: "Frontend", level: "Expert", icon: "bi-bootstrap", isPublished: true },
      { id: "sk-7", name: "React.js", category: "Frontend", level: "Proficient", icon: "bi-code-slash", isPublished: true },

      // Backend
      { id: "sk-8", name: "Django", category: "Backend", level: "Advanced", icon: "bi-layers", isPublished: true },
      { id: "sk-9", name: "Django REST Framework", category: "Backend", level: "Advanced", icon: "bi-hdd-network", isPublished: true },
      { id: "sk-10", name: "Flask", category: "Backend", level: "Proficient", icon: "bi-cpu", isPublished: true },
      { id: "sk-11", name: "RESTful APIs", category: "Backend", level: "Expert", icon: "bi-arrow-left-right", isPublished: true },

      // AI & Machine Learning
      { id: "sk-12", name: "Machine Learning (Supervised/Unsupervised)", category: "AI & Machine Learning", level: "Advanced", icon: "bi-robot", isPublished: true },
      { id: "sk-13", name: "Deep Learning (ANN, CNN, RNN)", category: "AI & Machine Learning", level: "Proficient", icon: "bi-diagram-3", isPublished: true },
      { id: "sk-14", name: "Natural Language Processing (NLP)", category: "AI & Machine Learning", level: "Advanced", icon: "bi-chat-dots", isPublished: true },
      { id: "sk-15", name: "Regression & Classification", category: "AI & Machine Learning", level: "Expert", icon: "bi-graph-up", isPublished: true },
      { id: "sk-16", name: "Clustering & Feature Engineering", category: "AI & Machine Learning", level: "Advanced", icon: "bi-pie-chart", isPublished: true },
      { id: "sk-17", name: "Scikit-Learn, Pandas & NumPy", category: "AI & Machine Learning", level: "Expert", icon: "bi-table", isPublished: true },
      { id: "sk-18", name: "OpenCV & OCR", category: "AI & Machine Learning", level: "Proficient", icon: "bi-eye", isPublished: true },

      // Generative AI
      { id: "sk-19", name: "Large Language Models (LLMs)", category: "Generative AI", level: "Advanced", icon: "bi-stars", isPublished: true },
      { id: "sk-20", name: "Retrieval-Augmented Generation (RAG)", category: "Generative AI", level: "Advanced", icon: "bi-database-check", isPublished: true },
      { id: "sk-21", name: "LangChain", category: "Generative AI", level: "Advanced", icon: "bi-link-45deg", isPublished: true },
      { id: "sk-22", name: "LangGraph (Agentic Workflows)", category: "Generative AI", level: "Advanced", icon: "bi-bezier2", isPublished: true },
      { id: "sk-23", name: "ChromaDB (Vector Database)", category: "Generative AI", level: "Advanced", icon: "bi-search", isPublished: true },
      { id: "sk-24", name: "Groq LLaMA 3.1 & Hugging Face", category: "Generative AI", level: "Proficient", icon: "bi-lightning-charge", isPublished: true },
      { id: "sk-25", name: "Prompt Engineering", category: "Generative AI", level: "Advanced", icon: "bi-magic", isPublished: true },

      // Cloud
      { id: "sk-26", name: "AWS (EC2, S3, IAM, Lambda, CloudWatch)", category: "Cloud", level: "Advanced", icon: "bi-cloud-check", isPublished: true },
      { id: "sk-27", name: "AWS (VPC, Route 53, ALB, Auto Scaling, RDS)", category: "Cloud", level: "Advanced", icon: "bi-diagram-2", isPublished: true },
      { id: "sk-28", name: "Microsoft Azure", category: "Cloud", level: "Proficient", icon: "bi-cloud", isPublished: true },

      // DevOps
      { id: "sk-29", name: "Docker & Docker Compose", category: "DevOps", level: "Advanced", icon: "bi-box-seam", isPublished: true },
      { id: "sk-30", name: "Kubernetes", category: "DevOps", level: "Proficient", icon: "bi-grid-3x3-gap", isPublished: true },
      { id: "sk-31", name: "Terraform & OpenTofu (IaC)", category: "DevOps", level: "Advanced", icon: "bi-file-earmark-code", isPublished: true },
      { id: "sk-32", name: "Jenkins & GitHub Actions (CI/CD)", category: "DevOps", level: "Advanced", icon: "bi-gear-wide-connected", isPublished: true },

      // Monitoring
      { id: "sk-33", name: "Prometheus & Node Exporter", category: "Monitoring", level: "Advanced", icon: "bi-activity", isPublished: true },
      { id: "sk-34", name: "Grafana Dashboards", category: "Monitoring", level: "Advanced", icon: "bi-speedometer2", isPublished: true },
      { id: "sk-35", name: "Splunk & AWS CloudWatch Logs", category: "Monitoring", level: "Proficient", icon: "bi-journal-text", isPublished: true },

      // Database
      { id: "sk-36", name: "MySQL & SQLite", category: "Database", level: "Expert", icon: "bi-database", isPublished: true },
      { id: "sk-37", name: "Oracle Database", category: "Database", level: "Proficient", icon: "bi-server", isPublished: true },

      // Tools
      { id: "sk-38", name: "Git & GitHub", category: "Tools", level: "Expert", icon: "bi-git", isPublished: true },
      { id: "sk-39", name: "VS Code & Postman", category: "Tools", level: "Expert", icon: "bi-code-square", isPublished: true },
      { id: "sk-40", name: "Linux / Ubuntu Environment", category: "Tools", level: "Advanced", icon: "bi-ubuntu", isPublished: true },
      { id: "sk-41", name: "Jupyter Notebook & PuTTY", category: "Tools", level: "Advanced", icon: "bi-book", isPublished: true }
    ],

    internships: [
      {
        id: "exp-1",
        role: "Machine Learning Intern",
        company: "Suven Consultants & Technology Pvt. Ltd.",
        duration: "March 2026 – May 2026",
        mode: "Remote",
        certificateCode: "7TAHHKML",
        certificateImage: "assets/images/certificates/suven_internship.png",
        certificatePdf: "",
        responsibilities: [
          "Developed Machine Learning models using Python and Scikit-learn for predictive analytics and data-driven applications.",
          "Worked on clustering analysis of Bitcoin transactions for entity behavior profiling using advanced clustering algorithms.",
          "Performed end-to-end data preprocessing, feature engineering, and rigorous model evaluation.",
          "Gained hands-on production exposure to Linux environments, Git version control, AWS Cloud, and Terraform DevOps deployment workflows."
        ],
        isPublished: true
      },
      {
        id: "exp-2",
        role: "Python & Data Science Intern",
        company: "YBI Foundation",
        duration: "June 2024 – July 2024",
        mode: "Remote",
        certificateCode: "WQ18O328SQELS",
        certificateImage: "assets/images/certificates/ybi_internship.png",
        certificatePdf: "assets/images/certificates/ybi_internship.pdf",
        responsibilities: [
          "Built regression and classification models using Scikit-learn, Pandas, and NumPy.",
          "Performed exploratory data analysis (EDA), statistical data cleaning, and insightful visualizations with Matplotlib and Seaborn.",
          "Automated data preprocessing pipelines using Python scripts to enhance model training workflow efficiency.",
          "Developed and evaluated end-to-end Python-based data science prototypes with version control."
        ],
        isPublished: true
      }
    ],

    projects: [
      {
        id: "proj-1",
        title: "SmartBite – AI Integrated Food Ordering System",
        category: "Web Development",
        tags: ["Python", "Django", "React.js", "Scikit-Learn", "NLP", "MySQL"],
        summary: "Full-stack AI-integrated food ordering system with personalized meal recommendations, sales forecasting, NLP review sentiment analysis, and dynamic admin analytics.",
        description: "SmartBite transforms online dining by combining full-stack web architecture with intelligent machine learning. Built with React.js frontend and Django REST Framework backend, it provides secure user authentication, interactive menu navigation, cart/order lifecycle management, automated sales prediction based on order trends, and an NLP customer review engine that classifies sentiment to give restaurant managers immediate operational insights.",
        features: [
          "Complete food ordering system with user authentication and payment workflow",
          "Dynamic menu catalog with category filtering and real-time cart updates",
          "Machine learning model for personalized food recommendations based on user history",
          "Sales forecasting engine to predict demand and prevent kitchen waste",
          "NLP-based customer review analysis classifying sentiments and feedback",
          "Comprehensive responsive admin analytics dashboard with order tracking"
        ],
        github: "https://github.com/Kedarling7838/smartbite-food-ordering-system",
        demo: "",
        image: "assets/images/projects/smartbite.png",
        isPublished: true
      },
      {
        id: "proj-2",
        title: "LangGraph Agent for Intelligent Web Information Retrieval",
        category: "Generative AI",
        tags: ["Python", "LangGraph", "LangChain", "Groq LLaMA 3.1", "Tavily API", "Streamlit"],
        summary: "Autonomous research agent executing cyclical graph-based reasoning loops with Tavily Search API and Groq LLaMA 3.1 inference for intelligent information synthesis.",
        description: "An advanced agentic application designed using LangGraph and LangChain to solve complex web retrieval tasks. Instead of simple one-shot prompts, the system formulates reasoning steps, executes search queries against the Tavily API, inspects search results, decides if additional queries are required, and generates cohesive structured summaries with full source attribution.",
        features: [
          "Cyclical agentic graph workflow built with LangGraph for iterative reasoning",
          "Integration with high-speed Groq LLaMA 3.1 LLM for low-latency reasoning",
          "Real-time Tavily Search API connectivity for up-to-date web intelligence",
          "Interactive Streamlit frontend backed by modular Python endpoints",
          "Fact verification and automated synthesis with source attribution"
        ],
        github: "https://github.com/Kedarling7838/LangGraph-Agent-for-Intelligent-Web-Information-Retrieval",
        demo: "",
        image: "assets/images/projects/langgraph_agent.png",
        isPublished: true
      },
      {
        id: "proj-3",
        title: "AI Powered Document Question Answering using RAG",
        category: "Generative AI",
        tags: ["Python", "LangChain", "ChromaDB", "Vector Embeddings", "RAG"],
        summary: "Retrieval-Augmented Generation system enabling contextual semantic search and accurate question answering over proprietary document collections.",
        description: "Production-ready RAG pipeline that processes unstructured documents (PDFs, text), splits them into contextual semantic chunks, embeds them into a vector space, and stores them in ChromaDB. When users ask queries, the system performs vector similarity search to retrieve relevant passages and synthesize accurate, hallucination-free answers.",
        features: [
          "End-to-end document ingestion and semantic chunking pipeline",
          "ChromaDB vector database indexing with high-dimensional embeddings",
          "Similarity score thresholding and context augmentation",
          "Accurate, cited question answering without hallucinations",
          "Support for technical documentation, academic papers, and enterprise manuals"
        ],
        github: "https://github.com/Kedarling7838/RAG_CROMADB",
        demo: "",
        image: "assets/images/projects/rag_chromadb.png",
        isPublished: true
      },
      {
        id: "proj-4",
        title: "AI Powered Medicine Expiry Detection and Smart Alert System",
        category: "AI/ML",
        tags: ["Python", "OpenCV", "Tesseract OCR", "Machine Learning", "IoT"],
        summary: "Computer vision and OCR application that detects expiry dates on medicine strips and issues real-time smart alerts to prevent accidental usage. (Certified with 1% Plagiarism Match at GM University).",
        description: "Developed and verified at GM University, this system captures imagery of pharmaceutical packaging, applies digital image processing filters (adaptive thresholding, noise reduction), uses OCR to extract printed text patterns, and parses expiration dates using intelligent regex and machine learning classifiers to trigger alerts.",
        features: [
          "Computer vision preprocessing pipeline with OpenCV for low-light legibility",
          "High-accuracy optical character recognition (OCR) of embossed and printed dates",
          "Intelligent date parsing and expiration risk classification",
          "Automated notifications and auditory smart alerts",
          "Officially cleared with 1% plagiarism threshold by GM University library"
        ],
        github: "https://github.com/Kedarling7838",
        demo: "",
        image: "assets/images/projects/medicine_expiry.png",
        isPublished: true
      },
      {
        id: "proj-5",
        title: "AI Based Salary Prediction System",
        category: "AI/ML",
        tags: ["Python", "Scikit-Learn", "Streamlit", "Flask", "Pandas"],
        summary: "Interactive predictive modeling tool using Scikit-learn regression algorithms to forecast competitive software industry compensation based on multi-variate factors.",
        description: "Built with Python, Scikit-learn, and Streamlit, this data science application cleans and normalizes multi-dimensional compensation datasets, evaluates multiple regression algorithms (Linear, Random Forest, Gradient Boosting), and presents an intuitive user interface for hiring managers and engineers to estimate fair compensation.",
        features: [
          "Exploratory data analysis and feature engineering on industry salary data",
          "Trained regression models evaluated with RMSE and R² metrics",
          "Interactive sliders for experience, education, role, and location",
          "Real-time compensation range prediction and interactive visualization"
        ],
        github: "https://github.com/Kedarling7838/Sallary-app",
        demo: "",
        image: "assets/images/projects/salary_prediction.png",
        isPublished: true
      },
      {
        id: "proj-6",
        title: "Terraform-Based Serverless File Upload Monitoring System",
        category: "DevOps",
        tags: ["Python", "AWS Lambda", "Amazon S3", "CloudWatch", "Terraform", "IAM"],
        summary: "Infrastructure as Code (IaC) automated serverless solution monitoring S3 bucket uploads, triggering Lambda computations, and streaming centralized CloudWatch logs.",
        description: "Architected using Infrastructure as Code principles with Terraform. Provisions an AWS environment where S3 object creation triggers an AWS Lambda serverless function for automated file validation and metadata extraction, with detailed metric publishing to Amazon CloudWatch and least-privilege IAM policies.",
        features: [
          "Automated cloud provisioning via modular Terraform configuration",
          "Event-driven architecture with Amazon S3 triggering Lambda on object create",
          "Least-privilege IAM security roles and granular policy attachments",
          "Centralized observability with CloudWatch log groups and execution metrics",
          "Zero server management overhead with 100% serverless scaling"
        ],
        github: "https://github.com/Kedarling7838/Terraform-Based-Serverless-File-Processing-with-AWS-Lambda-and-S3",
        demo: "",
        image: "assets/images/projects/terraform_serverless.png",
        isPublished: true
      },
      {
        id: "proj-7",
        title: "Export CloudWatch Logs to Amazon S3 using AWS Lambda",
        category: "Cloud",
        tags: ["Python", "AWS Lambda", "Amazon CloudWatch", "Amazon S3", "IAM"],
        summary: "Serverless automation architecture that periodically collects, batches, and exports Amazon CloudWatch log streams into compressed S3 storage for long-term audit.",
        description: "Cloud cost optimization and compliance solution designed to prevent runaway CloudWatch log storage fees. A scheduled Python Lambda function identifies log streams older than specified thresholds, creates export tasks to Amazon S3, verifies task completion, and ensures encryption at rest.",
        features: [
          "Scheduled execution via EventBridge / CloudWatch Events cron triggers",
          "Automated export of multi-service log groups to target S3 storage",
          "Configured IAM roles with least privilege for Lambda execution",
          "Reduced cloud operational costs while retaining compliance audit trails"
        ],
        github: "https://github.com/Kedarling7838/aws-cloudwatch-logs-export-to-s3",
        demo: "",
        image: "assets/images/projects/cloudwatch_s3.png",
        isPublished: true
      },
      {
        id: "proj-8",
        title: "AWS EC2 Monitoring using Prometheus and Grafana",
        category: "DevOps",
        tags: ["AWS EC2", "Ubuntu Linux", "Prometheus", "Grafana", "Node Exporter"],
        summary: "Full-stack cloud monitoring infrastructure deployed on AWS EC2 with Prometheus metric scraping, Node Exporter agent, and custom Grafana visualization dashboards.",
        description: "Deployed on Ubuntu EC2 instances to establish real-time observability over CPU, RAM, disk I/O, and network throughput. Configured Prometheus scraping intervals and threshold alert rules, alongside rich dark-themed Grafana dashboards with stress testing validation.",
        features: [
          "Automated Node Exporter deployment for OS-level metric aggregation",
          "Configured Prometheus server with target scraping jobs and retention policies",
          "Designed dynamic Grafana dashboards with visual alerts and threshold gates",
          "Simulated high CPU and memory loads using stress utilities to test alerts"
        ],
        github: "https://github.com/Kedarling7838/Grafana",
        demo: "",
        image: "assets/images/projects/ec2_grafana.png",
        isPublished: true
      },
      {
        id: "proj-9",
        title: "AWS Three-Tier Web Application Deployment",
        category: "Cloud",
        tags: ["AWS EC2", "VPC", "Route 53", "Auto Scaling", "ALB", "RDS", "Nginx"],
        summary: "Production-ready, highly available 3-tier cloud architecture with public/private VPC subnets, NAT Gateways, Application Load Balancer, and RDS database.",
        description: "Engineered according to AWS Well-Architected Framework guidelines. The presentation tier features Nginx reverse proxies behind an Application Load Balancer with Auto Scaling; the application tier executes secure Python business logic across private subnets; the database tier resides in private subnets with managed RDS MySQL.",
        features: [
          "Custom Amazon VPC with isolated public and private multi-AZ subnets",
          "Internet Gateway, NAT Gateways, and strict Route Table configurations",
          "Application Load Balancer (ALB) distributing traffic across Auto Scaling instances",
          "Managed Amazon RDS MySQL instance residing in secure private database subnets",
          "Domain routing via Route 53 with SSL/TLS termination and Nginx proxy"
        ],
        github: "https://github.com/Kedarling7838",
        demo: "",
        image: "assets/images/projects/aws_three_tier.png",
        isPublished: true
      }
    ],

    achievements: [
      {
        id: "ach-1",
        title: "100/100 Perfect Score in Python Programming",
        organization: "Rani Chennamma University / KLE CCAC Chikodi",
        date: "IV Semester Examination",
        category: "Academic Excellence",
        image: "assets/images/achievements/python_100_score.jpg",
        description: "Achieved a flawless 100 out of 100 marks in the university examination for Python Programming during the IV Semester of Bachelor of Computer Applications (BCA). Commended by the college management and academic board.",
        isPublished: true
      },
      {
        id: "ach-2",
        title: "Runner-Up in State-Level Coding Hackathon 'INVINCIO-2.0'",
        organization: "KLE's PCJabin BCA College, Hubballi",
        date: "State-Level Competition",
        category: "Coding Competition",
        image: "assets/images/achievements/invincio_runnerup_banner.jpg",
        description: "Secured 2nd Prize / Runner-Up in the highly competitive state-level intercollegiate coding contest 'INVINCIO-2.0' among top participants from across Karnataka. Achievement shared with coding partner Aditya Kamate.",
        isPublished: true
      },
      {
        id: "ach-3",
        title: "INVINCIO-2.0 Trophies & Recognition",
        organization: "KLE CCAC Chikodi & PCJabin Science College",
        date: "Award Ceremony",
        category: "Trophies & Honors",
        image: "assets/images/achievements/invincio_trophies.jpg",
        description: "Proudly presenting the prestigious INVINCIO-2.0 Runner-up trophies alongside teammate Aditya Kamate and Department Head / Mentor at the college reception.",
        isPublished: true
      },
      {
        id: "ach-4",
        title: "INVINCIO-2.0 Grand Stage Award Presentation",
        organization: "KLE's PCJabin Science College Hubballi",
        date: "Valedictory Ceremony",
        category: "Stage Felicitation",
        image: "assets/images/achievements/invincio_stage_award.jpg",
        description: "Receiving the official Runner-up Certificate of Merit and trophies from esteemed dignitaries and academic leaders on stage during the grand valedictory ceremony.",
        isPublished: true
      },
      {
        id: "ach-5",
        title: "Special Recognition & Felicitation by Faculty",
        organization: "KLE CCAC Chikodi",
        date: "Academic Year Celebration",
        category: "Faculty Recognition",
        image: "assets/images/achievements/faculty_recognition.jpg",
        description: "Felicitation by respected college principal and professors in recognition of outstanding programming achievements, coding contest victories, and dedication to software development.",
        isPublished: true
      },
      {
        id: "ach-6",
        title: "MCA Academic Batch Commemoration",
        organization: "GM University, Davanagere",
        date: "2024 – 2026 Batch",
        category: "Batch Commemoration",
        image: "assets/images/achievements/college_group_photo.jpg",
        description: "Official commemorative photograph with department professors, academic mentors, and fellow MCA graduates at the GM University campus steps.",
        isPublished: true
      },
      {
        id: "ach-7",
        title: "Plagiarism Clearance Certificate (1% Match)",
        organization: "GM University Library",
        date: "02.09.2026",
        category: "Research Clearance",
        image: "assets/images/achievements/medicine_plagiarism_cert.jpg",
        description: "Official Anti-Plagiarism Clearance certificate issued by GM University Chief Librarian and Director for 'AI-Powered IoT-Based Medicine Expiry Detection and Smart Alert System' with a verified 1% match score on DrillBit software.",
        isPublished: true
      }
    ],

    certifications: [
      {
        id: "cert-1",
        title: "Artificial Intelligence with Microsoft Azure",
        issuer: "ICT Academy & Microsoft",
        date: "January 2025",
        credentialId: "ICT-MS-AI-2025",
        image: "assets/images/certificates/reliance_ai_ml.png",
        pdf: "",
        skills: ["Azure Cognitive Services", "Cloud AI", "Model Deployment", "Computer Vision"],
        isPublished: true
      },
      {
        id: "cert-2",
        title: "Power BI for Beginners",
        issuer: "Simplilearn & Microsoft SkillUp",
        date: "14th July 2025",
        credentialId: "8624278",
        image: "assets/images/certificates/simplilearn_powerbi.png",
        pdf: "assets/images/certificates/simplilearn_powerbi.pdf",
        skills: ["Power BI", "Data Modeling", "Business Intelligence", "DAX", "Dashboards"],
        isPublished: true
      },
      {
        id: "cert-3",
        title: "Machine Learning Internship Certificate",
        issuer: "Suven Consultants & Technology Pvt. Ltd.",
        date: "08 May 2026",
        credentialId: "7TAHHKML",
        image: "assets/images/certificates/suven_internship.png",
        pdf: "",
        skills: ["Machine Learning", "Bitcoin Transaction Clustering", "Scikit-Learn", "DevOps"],
        isPublished: true
      },
      {
        id: "cert-4",
        title: "Data Science & Machine Learning Internship",
        issuer: "YBI Foundation",
        date: "22 July 2024",
        credentialId: "WQ18O328SQELS",
        image: "assets/images/certificates/ybi_internship.png",
        pdf: "assets/images/certificates/ybi_internship.pdf",
        skills: ["Data Science", "Python", "NumPy & Pandas", "Predictive Analytics"],
        isPublished: true
      },
      {
        id: "cert-5",
        title: "AI-Machine Learning Engineer Certificate",
        issuer: "Reliance Foundation Skilling Academy",
        date: "06 July 2025",
        credentialId: "RFSA000237689",
        image: "assets/images/certificates/reliance_ai_ml.png",
        pdf: "assets/images/certificates/reliance_ai_ml.pdf",
        skills: ["AI Engineering", "Supervised Learning", "Deep Learning", "Model Evaluation"],
        isPublished: true
      },
      {
        id: "cert-6",
        title: "Data Science & Analytics",
        issuer: "HP LIFE",
        date: "Certified Course",
        credentialId: "HP-LIFE-DS",
        image: "assets/images/certificates/hp_life_data_science.png",
        pdf: "assets/images/certificates/hp_life_data_science.pdf",
        skills: ["Data-driven Decision Making", "Analytics Methodologies", "Business Metrics"],
        isPublished: true
      },
      {
        id: "cert-7",
        title: "Certificate of Professional Mastery",
        issuer: "EgoTech World (Pvt) Ltd",
        date: "Distinction Certified",
        credentialId: "PV-00352315",
        image: "assets/images/certificates/egotech_mastery.png",
        pdf: "assets/images/certificates/egotech_mastery.pdf",
        skills: ["Software Engineering", "Full-Stack Web Development", "Cloud Systems"],
        isPublished: true
      }
    ],

    resumes: [
      {
        id: "res-1",
        title: "Python Developer Resume",
        version: "v2026.1",
        category: "Full Stack & Backend",
        description: "Highlights expertise in Python, Django, Django REST Framework, React.js, RESTful APIs, SQL databases, and full-stack software engineering.",
        pdfUrl: "assets/resumes/KedarlingKanade_Python_Developer.pdf",
        previewImage: "assets/images/resumes/resume_python.png",
        isDefault: true,
        isPublished: true
      },
      {
        id: "res-2",
        title: "Machine Learning / AI Resume",
        version: "v2026.1",
        category: "AI, ML & Generative AI",
        description: "Focuses on Machine Learning, Deep Learning, LLMs, RAG architectures, LangChain, LangGraph, ChromaDB, Scikit-learn, and OpenCV.",
        pdfUrl: "assets/resumes/KedarlingKanade_MachineLearning.pdf",
        previewImage: "assets/images/resumes/resume_ml.png",
        isDefault: false,
        isPublished: true
      },
      {
        id: "res-3",
        title: "DevOps & Cloud Resume",
        version: "v2026.1",
        category: "Cloud Architecture & DevOps",
        description: "Emphasizes AWS cloud architectures, Terraform (IaC), Docker, Kubernetes, Jenkins CI/CD pipelines, Prometheus & Grafana monitoring.",
        pdfUrl: "assets/resumes/KedarlingKanade_DevOps__Cloud.pdf",
        previewImage: "assets/images/resumes/resume_devops.png",
        isDefault: false,
        isPublished: true
      }
    ],

    messages: [], // Contact inquiries stored locally or in Supabase

    settings: {
      siteTitle: "Kedarling Kanade | Portfolio",
      enableCursorGlow: true,
      enableParticles: true,
      contactEmailRecipient: "kedarkanade9417@gmail.com",
      adminPasscodeHash: "admin123", // default local passcode fallback
      theme: "dark"
    }
  }
};

// Make available globally
window.CONFIG = CONFIG;
