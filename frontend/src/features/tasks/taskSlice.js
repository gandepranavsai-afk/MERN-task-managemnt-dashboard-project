import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchTasks = createAsyncThunk("tasks/fetch", async (params = {}) => {
  const { data } = await api.get("/tasks", { params });
  return data.tasks;
});

export const createTask = createAsyncThunk("tasks/create", async (payload) => {
  const { data } = await api.post("/tasks", payload);
  return data.task;
});

export const updateTask = createAsyncThunk("tasks/update", async ({ id, payload }) => {
  const { data } = await api.patch(`/tasks/${id}`, payload);
  return data.task;
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: { items: [], loading: false, filters: {} },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.items = state.items.map((task) => (task._id === action.payload._id ? action.payload : task));
      });
  }
});

export const { setFilters } = taskSlice.actions;
export default taskSlice.reducer;
