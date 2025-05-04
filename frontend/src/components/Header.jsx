import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.reload();
    toast.info("You have been logged out.");
  };

  return (
    <header className="bg-deepTeal text-white font-kalnia shadow-md border-b-4 border-aquaMint sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        {/* App Logo/Name */}
        <Link
          to="/"
          className="text-3xl font-bold text-white hover:text-skyBlue transition"
        >
          🌍 WorldViewApp
        </Link>

        {/* Navigation links */}
        <div className="flex items-center space-x-6 text-base">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-aquaMint transition font-semibold"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-aquaMint transition font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="hover:text-aquaMint transition font-semibold"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};


export default Header;
