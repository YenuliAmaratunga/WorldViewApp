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
    <header className="bg-darkGreen text-[#FFFDF5] p-4 font-[Kalnia] flex justify-between items-center">
      <Link to="/" className="text-xl font-bold hover:underline">
        🌍 WorldViewApp
      </Link>
      <div className="text-sm">
        {user ? (
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4 hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
