import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <header className="bg-deepTeal text-white font-kalnia shadow-md">
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
