/**
 * Contact Form Module - Kedarling Kanade Portfolio
 * Handles form validation, SweetAlert2 alerts, reliable mailto fallback & message logging
 */

class PortfolioContact {
  constructor() {
    this.form = document.getElementById("contactForm");
  }

  init() {
    this.form = document.getElementById("contactForm");
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const subject = document.getElementById("contactSubject")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    // Validation
    if (!name || !email || !subject || !message) {
      if (window.Swal) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Form",
          text: "Please fill in all required fields (Name, Email, Subject, and Message) before submitting.",
          background: "#0d1527",
          color: "#f8fafc",
          confirmButtonColor: "#38bdf8"
        });
      } else {
        alert("Please fill in all required fields.");
      }
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (window.Swal) {
        Swal.fire({
          icon: "error",
          title: "Invalid Email Address",
          text: "Please enter a valid email address so Kedarling can reply to you.",
          background: "#0d1527",
          color: "#f8fafc",
          confirmButtonColor: "#38bdf8"
        });
      } else {
        alert("Please enter a valid email address.");
      }
      return;
    }

    // Save message locally into data store
    const newMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject,
      message,
      submittedAt: new Date().toISOString()
    };

    if (window.portfolioStorage) {
      const data = window.portfolioStorage.getData();
      data.messages = data.messages || [];
      data.messages.unshift(newMessage);
      window.portfolioStorage.saveData(data);
    }

    const recipient = (window.CONFIG && window.CONFIG.defaultData && window.CONFIG.defaultData.profile.email)
      ? window.CONFIG.defaultData.profile.email
      : "kedarkanade9417@gmail.com";

    // Direct mailto link preparation
    const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;

    // SweetAlert2 Confirmation & Mail Option
    if (window.Swal) {
      Swal.fire({
        title: "Message Prepared!",
        text: `Your message has been saved. To ensure immediate real-time delivery to Kedarling's inbox (${recipient}), would you like to launch your default email client right now?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: '<i class="bi bi-envelope-check"></i> Send via Email Client',
        cancelButtonText: 'Keep in Message Box',
        confirmButtonColor: "#38bdf8",
        cancelButtonColor: "#64748b",
        background: "#0d1527",
        color: "#f8fafc"
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = mailtoUrl;
        }
      });
    } else {
      window.location.href = mailtoUrl;
    }

    // Reset form
    this.form.reset();
  }
}

// Global instance
window.portfolioContact = new PortfolioContact();
