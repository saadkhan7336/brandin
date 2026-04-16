import { createSlice } from "@reduxjs/toolkit";

const presenceSlice = createSlice({
  name: "presence",
  initialState: {
    users: {}, // { userId: { status: "active" | "offline", lastActive: Date } }
  },
  reducers: {
    updateUserPresence: (state, action) => {
      const { userId, status, lastActive } = action.payload;
      if (userId) {
        state.users[userId] = {
          status,
          lastActive: lastActive || new Date().toISOString(),
        };
      }
    },
    setMultiplePresences: (state, action) => {
      // payload: array of { _id, status, lastActive }
      action.payload.forEach((user) => {
        if (user._id) {
          state.users[user._id] = {
            status: user.status || "active",
            lastActive: user.lastActive || new Date().toISOString(),
          };
        }
      });
    },
  },
});

export const { updateUserPresence, setMultiplePresences } = presenceSlice.actions;
export default presenceSlice.reducer;
