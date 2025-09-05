import { useState } from "react";
import signinIcon from "../assets/images/signin_icon.png";
import signinIcon2 from "../assets/images/signin_icon2.png";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", form);
    alert(`Login success!\nEmail: ${form.email}`);

  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <div className="flex justify-center">
          <img
            src={signinIcon}
            alt="Sign In Icon"
            className="w-14 h-14 mb-2"
          />
        </div>

        <h2 className="text-2xl font-bold text-center">Login</h2>
        <p class="flex justify-center">Please sign in to continue</p>


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


            <p class="flex justify-center">
          Dont have any account ?  <span>
            <Link to="/register">
                 Register here
            </Link>
          </span>
        </p>



      </form>
    </div>
  );
}
