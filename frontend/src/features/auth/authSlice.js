import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const login = createAsyncThunk("auth/login", async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  localStorage.setItem("taskflow_token", data.token);
  return data.user;
});

export const register = createAsyncThunk("auth/register", async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  localStorage.setItem("taskflow_token", data.token);
  return data.user;
});

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("taskflow_token");
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        localStorage.removeItem("taskflow_token");
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
