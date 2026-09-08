import { createContext, useContext, useEffect, useState } from "react";
import authService, { getCurrentUser, register as apiRegister, login as apiLogin, logout as apiLogout } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("prepforge_current_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Validate session against backend /api/auth/me on mount & page refresh
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const token = localStorage.getItem("prepforge_token");
      if (!token) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      const res = await getCurrentUser();
      if (isMounted) {
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    };

    verifySession();

    // Listen for global 401 unauthorized events from centralized api client
    const handleUnauthorized = () => {
      if (isMounted) {
        setUser(null);
      }
    };

    window.addEventListener("prepforge:unauthorized", handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener("prepforge:unauthorized", handleUnauthorized);
    };
  }, []);

  const isAuthenticated = !!user;

  const clearError = () => {
    setError("");
  };

  const signup = async ({ name, email, password }) => {
    try {
      setError("");
      const res = await apiRegister({ name, email, password });

      if (!res.success) {
        setError(res.error || "Something went wrong while creating your account.");
        return false;
      }

      setUser(res.user);
      return true;
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to complete registration. Please check your connection.");
      return false;
    }
  };

  const login = async ({ email, password }) => {
    try {
      setError("");
      const res = await apiLogin({ email, password });

      if (!res.success) {
        setError(res.error || "Invalid email or password.");
        return false;
      }

      setUser(res.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to complete login. Please check your connection.");
      return false;
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setError("");
  };

  const forgotPassword = async ({ email }) => {
    if (!email || !email.trim()) {
      return { message: "Email address is required." };
    }
    return {
      message: `If an account exists for ${email}, password reset instructions will be sent.`,
    };
  };

  const updateUser = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("prepforge_current_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        isAuthenticated,
        loading,
        signup,
        login,
        logout,
        error,
        clearError,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;