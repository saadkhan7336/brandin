import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import activityService from '../../services/activityService';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await activityService.getActivities(params);
      return response.data; // { activities, total, pages, page }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await activityService.markAsRead(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await activityService.markAllAsRead();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteActivity = createAsyncThunk(
  'notifications/delete',
  async (id, { rejectWithValue }) => {
    try {
      await activityService.deleteActivity(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    total: 0,
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      pages: 1,
    }
  },
  reducers: {
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.activities;
        state.total = action.payload.total;
        state.pagination.pages = action.payload.pages;
        state.unreadCount = action.payload.activities.filter(n => !n.isRead).length; // This is naive, ideally backend returns unreadCount
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.items[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark All Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })
      // Delete
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.items = state.items.filter(n => n._id !== action.payload);
        state.total -= 1;
      });
  }
});

export const { setPage } = notificationSlice.actions;
export default notificationSlice.reducer;
