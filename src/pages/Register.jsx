import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

const API_URL = "https://683f24371cd60dca33de6ad4.mockapi.io/Users";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "confirmPassword" || e.target.name === "password") {
      if (
        (e.target.name === "confirmPassword" && e.target.value !== form.password) ||
        (e.target.name === "password" && form.confirmPassword !== e.target.value)
      ) {
        setError("Passwords do not match");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(API_URL);
      const users = res.data;

      const usernameExists = users.some(
        (user) => user.username.toLowerCase() === form.username.toLowerCase()
      );
      if (usernameExists) {
        setError("Username is already taken");
        setLoading(false);
        return;
      }

      const emailExists = users.some(
        (user) => user.email.toLowerCase() === form.email.toLowerCase()
      );
      if (emailExists) {
        setError("Email is already registered");
        setLoading(false);
        return;
      }

      const { confirmPassword, ...userData } = form;
      await axios.post(API_URL, userData);

      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error during registration", error);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-lg w-full max-w-md space-y-4 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          required
        />

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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full p-2 rounded bg-zinc-800 text-white"
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-red-600 hover:bg-red-700 rounded font-bold disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
