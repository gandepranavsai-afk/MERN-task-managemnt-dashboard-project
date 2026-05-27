import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  const { data } = await api.get("/projects");
  return data.projects;
});

export const createProject = createAsyncThunk("projects/create", async (payload) => {
  const { data } = await api.post("/projects", payload);
  return data.project;
});

const projectSlice = createSlice({
  name: "projects",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  }
});

export default projectSlice.reducer;
