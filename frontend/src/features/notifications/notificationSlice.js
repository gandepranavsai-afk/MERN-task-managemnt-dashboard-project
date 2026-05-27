import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/client";

export const fetchNotifications = createAsyncThunk("notifications/fetch", async () => {
  const { data } = await api.get("/notifications");
  return data.notifications;
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

export default notificationSlice.reducer;
