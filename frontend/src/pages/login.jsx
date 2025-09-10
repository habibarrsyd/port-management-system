import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import signinIcon from "../assets/images/signin_icon.png";
import signinIcon2 from "../assets/images/signin_icon2.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      toast.error('Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    toast.success('Login successful!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    console.log("User logged in:", data.user);
    
    // Delay navigasi agar toast sempat muncul
    setTimeout(() => {
      navigate("/upload");
    }, 2500); // 2.5 detik (sesuaikan dengan autoClose toast)
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div className="flex justify-center">
          <img src={signinIcon} alt="Sign In Icon" className="w-14 h-14 mb-2" />
        </div>

        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p className="flex justify-center">Please sign in to continue</p>

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
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <img src={signinIcon2} alt="Sign In" className="w-5 h-5" />
          <span>Sign In</span>
        </button>

        <p className="flex justify-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}