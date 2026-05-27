import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../features/auth/authSlice";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", remember: true });

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(login(form)).unwrap();
    if (!form.remember) sessionStorage.setItem("taskflow_token", localStorage.getItem("taskflow_token") || "");
    toast.success("Welcome back");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-violet-500 to-cyan-500 p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl space-y-3">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <input className="w-full border rounded-xl p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full border rounded-xl p-2" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="text-sm flex gap-2"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />Remember me</label>
        <button className="w-full bg-primary text-white rounded-xl p-2">Login</button>
        <p className="text-sm">No account? <Link to="/register" className="text-primary">Register</Link></p>
      </form>
    </div>
  );
};
