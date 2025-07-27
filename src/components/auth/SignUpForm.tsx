import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    if (role === "user") {
      navigate("/salesperson-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f5] p-4 w-full">
      <div className="w-full max-w-[880px] p-8 bg-[#CCCCCC] rounded-2xl shadow-sm">
        {/* Logo */}
        <div className=" flex justify-center">
        <div className="my-10 text-center w-[330px]">
          <img
            src="./images/logo/GeneysLogo.png" 
            alt="motor Logo"
            className="mx-auto h-20 w-auto" 
          />
        </div>
        </div>

        {/* Role Selector */}
        <div className="justify-center flex">
          <div className="flex mb-6 min-w-[340px] max-w-[300px]">
            <button
              onClick={() => setRole("user")}
              className={`flex-1 py-2 text-sm ${role === "user" ? "font-bold text-white border-b-2 border-black bg-[#333333]" : "text-gray-500 hover:bg-gray-100 border"} rounded-lg transition-all`}
            >
              SalesPerson
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 text-sm ${role === "admin" ? "font-bold text-white border-b-2 border-black bg-[#333333]" : "text-gray-500 hover:bg-gray-100 border"} rounded-lg transition-all`}
            >
              Admin
            </button>
          </div>
        </div>


        {/* Form */}
        <div className="justify-center flex">
          <div className="min-w-[340px] max-w-[340px]">
            <form onSubmit={handleSignIn}>
              <div className="space-y-5">
                <div>
                  
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                <div>
                 
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-3 py-2 text-sm border border-black rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
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
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="diamondise"
                      className="w-4 h-4 text-black rounded bg-transparent focus:ring-black"
                    />
                    <label htmlFor="diamondise" className="ml-2 text-sm text-gray-700">
                      Remember Me
                    </label>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-40 py-2 mt-4 text-sm font-medium text-white bg-[#333333] rounded-3xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                  Sign Up
                </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-gray-800 hover:text-black"
            >
              signup
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
}