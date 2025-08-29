import React, { useState, useEffect } from "react";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../authContext";

const Login = () => {
  const { currentUser, setCurrentUser } = useAuth();
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  },[]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data.message === "Invalid Credentials"
      ) {
        alert("Invalid Credential");
      } else {
        alert("LogIn Failed!!");
      }
      console.error("Error during login : ", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-2">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">Log In</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition duration-200"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            {" "}
            Didn't have an account?{" "}
            <Link
              to={"/signup"}
              className="text-blue-400 hover:underline"
            >Signup</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
