import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "../../features/auth/authSlice";

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const token = localStorage.getItem("taskflow_token");

  useEffect(() => {
    if (token && !user) dispatch(fetchMe());
  }, [dispatch, token, user]);

  if (token && !user) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-100">
        <p className="text-slate-600">{loading ? "Loading session…" : "Restoring session…"}</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
