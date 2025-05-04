import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });

      // Save the token in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      navigate("/"); // redirect after login
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-deepTeal via-oceanGreen to-aquaMint">
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-4 border-skyBlue"
        >
          <h2 className="text-4xl font-bold text-center mb-6 font-kalnia text-deepTeal">
            Login to WorldViewApp
          </h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanGreen"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full mb-4 p-3 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanGreen"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-sm text-oceanGreen"
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-deepTeal text-white py-3 rounded-xl hover:bg-oceanGreen transition font-kalnia text-xl"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm">
            Don't have an account? {" "}
            <Link
              to="/signup"
              className="text-oceanGreen font-bold hover:underline"
            >
              Sign up!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
