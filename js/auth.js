/**
 * Authentication Module for Kedarling Kanade Portfolio
 * Supports:
 * 1. Supabase Auth (Email / Password login with RLS)
 * 2. Local Mode Admin Session (Protected passcode for offline / self-hosted environments)
 */

class PortfolioAuth {
  constructor() {
    this.sessionKey = CONFIG.authKey;
    this.currentUser = null;
    this.authListeners = [];
  }

  /**
   * Initialize auth state
   */
  async init() {
    await window.portfolioStorage.init();

    // Check Supabase session first
    if (window.portfolioStorage.isCloudMode() && window.portfolioStorage.supabaseClient) {
      try {
        const { data: { session } } = await window.portfolioStorage.supabaseClient.auth.getSession();
        if (session && session.user) {
          this.currentUser = {
            id: session.user.id,
            email: session.user.email,
            mode: "supabase",
            token: session.access_token
          };
          this.persistSession(this.currentUser);
          return this.currentUser;
        }
      } catch (e) {
        console.warn("Supabase session check error:", e);
      }
    }

    // Check local session
    const localSession = this.getStoredSession();
    if (localSession && localSession.expiresAt > Date.now()) {
      this.currentUser = localSession;
      return this.currentUser;
    } else {
      this.clearSession();
      return null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated() {
    const session = this.getStoredSession();
    return !!(session && session.expiresAt > Date.now());
  }

  /**
   * Get current authenticated user
   */
  getUser() {
    return this.currentUser || this.getStoredSession();
  }

  /**
   * Login using Supabase Auth
   */
  async loginSupabase(email, password) {
    if (!window.portfolioStorage.isCloudMode() || !window.portfolioStorage.supabaseClient) {
      throw new Error("Supabase is not configured or enabled.");
    }

    const { data, error } = await window.portfolioStorage.supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    const user = {
      id: data.user.id,
      email: data.user.email,
      mode: "supabase",
      token: data.session.access_token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };

    this.persistSession(user);
    this.currentUser = user;
    this.triggerAuthChange(user);
    return user;
  }

  /**
   * Login using local administrator passcode
   */
  loginLocal(passcode) {
    const data = window.portfolioStorage.getData();
    const storedPasscode = (data.settings && data.settings.adminPasscodeHash) || "admin123";

    if (passcode.trim() === storedPasscode.trim()) {
      const user = {
        id: "local-admin",
        email: data.profile.email || "admin@portfolio.local",
        mode: "local",
        role: "admin",
        expiresAt: Date.now() + 12 * 60 * 60 * 1000 // 12 hours
      };

      this.persistSession(user);
      this.currentUser = user;
      this.triggerAuthChange(user);
      return user;
    } else {
      throw new Error("Invalid administrator passcode. Default is 'admin123'.");
    }
  }

  /**
   * Logout from all sessions
   */
  async logout() {
    if (this.currentUser && this.currentUser.mode === "supabase" && window.portfolioStorage.supabaseClient) {
      try {
        await window.portfolioStorage.supabaseClient.auth.signOut();
      } catch (err) {
        console.warn("Supabase signout notice:", err);
      }
    }

    this.clearSession();
    this.currentUser = null;
    this.triggerAuthChange(null);
  }

  /**
   * Persist session in localStorage
   */
  persistSession(user) {
    try {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    } catch (e) {
      console.error("Session storage error:", e);
    }
  }

  /**
   * Get stored session
   */
  getStoredSession() {
    try {
      const raw = localStorage.getItem(this.sessionKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Clear session
   */
  clearSession() {
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * Listen to auth changes
   */
  onAuthChange(callback) {
    this.authListeners.push(callback);
  }

  triggerAuthChange(user) {
    this.authListeners.forEach(cb => {
      try { cb(user); } catch (e) { console.error(e); }
    });
  }
}

// Global instance
window.portfolioAuth = new PortfolioAuth();
