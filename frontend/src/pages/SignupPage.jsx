import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
  
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Please enter a valid email address.");
    }
  
    // Password regex validation
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError("Password must be at least 8 characters with letters and numbers.");
    }
  
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/register`, {
        name,
        email,
        password,
      });
  
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };  

 
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-deepTeal via-oceanGreen to-aquaMint">
      <div className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSignup}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border-4 border-skyBlue"
        >
          <h2 className="text-4xl font-bold text-center mb-6 font-kalnia text-deepTeal">
            Create your WorldViewApp Account
          </h2>

          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

          <input
            type="text"
            placeholder="Name"
            className="w-full mb-4 p-3 border border-softBeige rounded-lg focus:outline-none focus:ring-2 focus:ring-oceanGreen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Sign Up
          </button>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-oceanGreen font-bold hover:underline"
            >
              Login!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
