/**
 * Storage Service Layer for Kedarling Kanade Portfolio
 * Supports dual mode:
 * 1. Supabase Cloud Backend (PostgreSQL + Auth + Storage)
 * 2. Local Development Mode (localStorage + IndexedDB for large files/blobs)
 */

class PortfolioStorage {
  constructor() {
    this.storageKey = CONFIG.storageKey;
    this.dbName = "KedarlingPortfolioDB";
    this.dbVersion = 1;
    this.db = null;
    this.supabaseClient = null;
    this.initialized = false;
  }

  /**
   * Initialize Storage (IndexedDB and Supabase if configured)
   */
  async init() {
    if (this.initialized) return;

    // 1. Initialize IndexedDB for local file storage (PDFs and images)
    await this.initIndexedDB();

    // 2. Initialize Supabase if credentials are present
    const sbConfig = this.getSupabaseConfig();
    if (sbConfig && sbConfig.url && sbConfig.anonKey && sbConfig.enabled && window.supabase) {
      try {
        this.supabaseClient = window.supabase.createClient(sbConfig.url, sbConfig.anonKey);
        console.log("Supabase client initialized successfully.");
      } catch (err) {
        console.warn("Could not initialize Supabase client:", err);
        this.supabaseClient = null;
      }
    }

    // 3. Ensure default seed data exists in localStorage
    if (!localStorage.getItem(this.storageKey)) {
      this.resetToDefaults();
    }

    this.initialized = true;
  }

  /**
   * Setup IndexedDB for binary uploads (avoid localStorage quota exceeded errors)
   */
  initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("files")) {
          db.createObjectStore("files", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error("IndexedDB open error:", event.target.error);
        resolve(null); // Fallback gracefully
      };
    });
  }

  /**
   * Check if running in Cloud (Supabase) mode
   */
  isCloudMode() {
    const cfg = this.getSupabaseConfig();
    return !!(cfg && cfg.url && cfg.anonKey && cfg.enabled && this.supabaseClient);
  }

  /**
   * Get Supabase credentials
   */
  getSupabaseConfig() {
    try {
      const stored = localStorage.getItem(CONFIG.supabaseConfigKey);
      return stored ? JSON.parse(stored) : CONFIG.supabase;
    } catch {
      return CONFIG.supabase;
    }
  }

  /**
   * Save Supabase credentials
   */
  saveSupabaseConfig(cfg) {
    localStorage.setItem(CONFIG.supabaseConfigKey, JSON.stringify(cfg));
    if (cfg.url && cfg.anonKey && cfg.enabled && window.supabase) {
      try {
        this.supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
        return true;
      } catch (err) {
        console.error("Supabase config error:", err);
        return false;
      }
    } else {
      this.supabaseClient = null;
      return true;
    }
  }

  /**
   * Get full portfolio data object
   */
  getData() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return JSON.parse(JSON.stringify(CONFIG.defaultData));
      const parsed = JSON.parse(raw);
      // Merge with default keys to guard against schema changes
      return { ...CONFIG.defaultData, ...parsed };
    } catch (e) {
      console.error("Error reading localStorage, using defaults:", e);
      return JSON.parse(JSON.stringify(CONFIG.defaultData));
    }
  }

  /**
   * Save full portfolio data object
   */
  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      // Notify components about data change
      window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: data }));
      return true;
    } catch (e) {
      console.error("Error saving data to localStorage:", e);
      return false;
    }
  }

  /**
   * Get a specific collection (e.g. projects, skills, achievements)
   */
  getCollection(name) {
    const data = this.getData();
    return data[name] || [];
  }

  /**
   * Add or update an item in a collection
   */
  saveItem(collectionName, item) {
    const data = this.getData();
    if (!Array.isArray(data[collectionName])) {
      data[collectionName] = [];
    }

    if (!item.id) {
      item.id = `${collectionName.slice(0, 3)}-${Date.now()}`;
    }

    const index = data[collectionName].findIndex(x => x.id === item.id);
    if (index >= 0) {
      data[collectionName][index] = { ...data[collectionName][index], ...item };
    } else {
      data[collectionName].unshift(item);
    }

    this.saveData(data);
    return item;
  }

  /**
   * Delete an item from a collection
   */
  deleteItem(collectionName, itemId) {
    const data = this.getData();
    if (!Array.isArray(data[collectionName])) return false;
    data[collectionName] = data[collectionName].filter(x => x.id !== itemId);
    this.saveData(data);
    return true;
  }

  /**
   * Store binary file (PDF / Image)
   * In Supabase mode: uploads to Supabase Storage bucket 'portfolio-assets'
   * In Local mode: stores binary object in IndexedDB and generates persistent object URL
   */
  async uploadFile(file, category = "general") {
    const fileId = `${category}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Cloud upload if Supabase configured
    if (this.isCloudMode()) {
      try {
        const { data, error } = await this.supabaseClient.storage
          .from("portfolio-assets")
          .upload(`${category}/${fileId}`, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (error) throw error;

        const { data: publicUrlData } = this.supabaseClient.storage
          .from("portfolio-assets")
          .getPublicUrl(`${category}/${fileId}`);

        return {
          id: fileId,
          name: file.name,
          url: publicUrlData.publicUrl,
          size: file.size,
          type: file.type,
          isCloud: true
        };
      } catch (err) {
        console.warn("Supabase upload failed, falling back to IndexedDB local storage:", err);
      }
    }

    // Local IndexedDB fallback
    if (!this.db) await this.initIndexedDB();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileRecord = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl: e.target.result,
          uploadedAt: new Date().toISOString()
        };

        if (this.db) {
          const transaction = this.db.transaction(["files"], "readwrite");
          const store = transaction.objectStore("files");
          store.put(fileRecord);

          transaction.oncomplete = () => {
            resolve({
              id: fileId,
              name: file.name,
              url: fileRecord.dataUrl,
              size: file.size,
              type: file.type,
              isCloud: false
            });
          };

          transaction.onerror = (err) => {
            console.error("IndexedDB store error:", err);
            // Fallback to dataUrl directly
            resolve({
              id: fileId,
              name: file.name,
              url: fileRecord.dataUrl,
              size: file.size,
              type: file.type,
              isCloud: false
            });
          };
        } else {
          resolve({
            id: fileId,
            name: file.name,
            url: fileRecord.dataUrl,
            size: file.size,
            type: file.type,
            isCloud: false
          });
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Retrieve file from IndexedDB by id
   */
  async getLocalFile(fileId) {
    if (!this.db) await this.initIndexedDB();
    return new Promise((resolve) => {
      if (!this.db) return resolve(null);
      const transaction = this.db.transaction(["files"], "readonly");
      const store = transaction.objectStore("files");
      const request = store.get(fileId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  /**
   * Reset data to initial seed configuration
   */
  resetToDefaults() {
    const data = JSON.parse(JSON.stringify(CONFIG.defaultData));
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("portfolioDataChanged", { detail: data }));
    return data;
  }

  /**
   * Export all data as downloadable JSON backup
   */
  exportBackup() {
    const data = this.getData();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kedarling_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from JSON string
   */
  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid JSON structure");
      this.saveData(parsed);
      return true;
    } catch (e) {
      console.error("Backup import error:", e);
      return false;
    }
  }
}

// Global instance
window.portfolioStorage = new PortfolioStorage();
