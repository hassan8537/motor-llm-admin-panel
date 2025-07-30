import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import BASE_URL from "../../config";

// Types for the API response
interface User {
  UserId: string;
  Role: string;
  SK: string;
  PK: string;
  CreatedAt: string;
  Email: string;
}

interface SignInResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    user: User;
    token: string;
    expiresAt: string;
  };
}

// Session management utilities
const sessionManager = {
  setSession: (data: SignInResponse["data"]) => {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("tokenExpiry", data.expiresAt);
  },

  getSession: () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");
    const expiry = localStorage.getItem("tokenExpiry");

    if (!token || !user || !expiry) return null;

    // Check if token is expired
    if (new Date() > new Date(expiry)) {
      sessionManager.clearSession();
      return null;
    }

    return {
      token,
      user: JSON.parse(user),
      expiresAt: expiry,
    };
  },

  clearSession: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
  },

  isAuthenticated: () => {
    return sessionManager.getSession() !== null;
  },
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual API base URL

      const response = await fetch(`${BASE_URL}/api/v1/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data: SignInResponse = await response.json();

      if (data.success && data.status === 1) {
        // Store session data
        sessionManager.setSession(data.data);

        // Redirect based on user role
        const dashboardRoute = "/dashboard";

        navigate(dashboardRoute, {
          state: {
            showWelcomeModal: true,
            user: data.data.user,
          },
        });
      } else {
        setError(data.message || "Sign-in failed. Please try again.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#CCCCCC] p-4 w-full">
      <div className="w-full max-w-[880px] p-8 bg-[#CCCCCC]">
        <div className="flex justify-center">
          <div className="my-10 text-center w-[330px]">
            <h1 className="text-5xl" style={{ color: "#20443bff" }}>
              Motor LLM
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="justify-center flex">
          <div className="min-w-[340px] max-w-[340px]">
            <form onSubmit={handleSignIn}>
              <div className="space-y-5">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      required
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="w-4 h-4 text-gray-500" />
                      ) : (
                        <EyeCloseIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </span>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="w-4 h-4 text-black rounded bg-transparent focus:ring-black"
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-700"
                    >
                      Remember Me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Forgot Password?
                  </Link>
                </div> */}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-40 py-2 mt-4 text-sm font-medium text-white bg-[#333333] rounded-3xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Signing In..." : "Login"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export session manager for use in other components
export { sessionManager };
