import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../features/auth/authSlice";

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });

  const submit = async (e) => {
    e.preventDefault();
    await dispatch(register(form)).unwrap();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-4">
      <form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl space-y-3">
        <h1 className="text-2xl font-bold">Create account</h1>
        <input className="w-full border rounded-xl p-2" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full border rounded-xl p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full border rounded-xl p-2" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full border rounded-xl p-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button className="w-full bg-primary text-white rounded-xl p-2">Register</button>
      </form>
    </div>
  );
};
