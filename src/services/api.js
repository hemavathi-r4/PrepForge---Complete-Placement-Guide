/**
 * Mock API service for PrepForge.
 * This simulates REST API calls with simulated latency.
 * Real REST API integration can be done here in the future without modifying UI components.
 */

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Login user with email and password
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} User details
   */
  async login(email, password) {
    await delay(1000);
    
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    
    // Check if user exists in local storage
    const users = JSON.parse(localStorage.getItem("prepforge_users") || "[]");
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }
    
    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: "student",
      joinedAt: user.joinedAt
    };
    
    localStorage.setItem("prepforge_current_user", JSON.stringify(loggedInUser));
    return loggedInUser;
  },

  /**
   * Register a new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Registered user details
   */
  async signup(name, email, password) {
    await delay(1200);
    
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }
    
    const users = JSON.parse(localStorage.getItem("prepforge_users") || "[]");
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("Email is already registered.");
    }
    
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // In a real backend this is hashed, but fine for local mockup
      joinedAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("prepforge_users", JSON.stringify(users));
    
    const loggedInUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: "student",
      joinedAt: newUser.joinedAt
    };
    
    localStorage.setItem("prepforge_current_user", JSON.stringify(loggedInUser));
    return loggedInUser;
  },

  /**
   * Logout current user
   */
  async logout() {
    await delay(500);
    localStorage.removeItem("prepforge_current_user");
    return true;
  },

  /**
   * Get currently logged-in user
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    await delay(200);
    const userStr = localStorage.getItem("prepforge_current_user");
    return userStr ? JSON.parse(userStr) : null;
  }
};
