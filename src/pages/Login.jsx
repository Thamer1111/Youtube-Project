import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

const API_URL = "https://683f24371cd60dca33de6ad4.mockapi.io/Users";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(API_URL);
      const user = res.data.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
      } else {
        alert("Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          required
        />
        <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-bold">
          Login
        </button>
        <p className="text-sm text-center mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
