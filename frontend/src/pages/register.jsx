import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // pastikan sudah setup client
import signup_icon from "../assets/images/signup_icon.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Sign up user ke Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data.user;

    // 2. Simpan name ke tabel profiles (pakai id user dari auth.users)
    if (user) {
      await supabase.from("profiles").insert([
        { id: user.id, name: form.name }
      ]);
    }

    alert("Register success! Please login.");
    navigate("/login"); // redirect ke login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div className="flex justify-center">
          <img src={signup_icon} alt="signup_icon" />
        </div>
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <p className="text-center">Please input your data to register</p>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Register
        </button>

        <p className="flex justify-center">
          Already have account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
