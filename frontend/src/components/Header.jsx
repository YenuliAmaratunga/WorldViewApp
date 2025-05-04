import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-deepTeal text-white font-[Kalnia] shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-skyBlue transition">
          🌍 WorldViewApp
        </Link>
        <div className="text-sm space-x-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-aquaMint transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white hover:text-aquaMint transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white hover:text-aquaMint transition"
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
