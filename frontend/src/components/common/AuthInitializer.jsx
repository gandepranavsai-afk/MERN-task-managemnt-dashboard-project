import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMe } from "../../features/auth/authSlice";

export const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("taskflow_token");
    if (token) dispatch(fetchMe());
  }, [dispatch]);

  return children;
};
