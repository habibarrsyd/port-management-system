import { useState } from "react";
import { Link } from "react-router-dom";
import signup_icon from "../assets/images/signup_icon.png";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    alert(`Register success!\nName: ${form.name}\nEmail: ${form.email}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div class="flex justify-center">
          <img src={signup_icon} alt="signup_icon" />
        </div>
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <p class="text-center">Please input your data to register</p>

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
        
        <p class="flex justify-center">
          Already have account ?  <span>
            <Link to="/login">
                 Login here
            </Link>
          </span>
        </p>
      </form>
    </div>
  );
}
