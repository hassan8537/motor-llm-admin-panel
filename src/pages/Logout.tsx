import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage/session etc.
    localStorage.removeItem("token"); // or any auth data you use

    // Redirect to login
    navigate("/", { replace: true });
  }, [navigate]);

  return null; // Optional: You can add a loader if you want
};

export default Logout;
