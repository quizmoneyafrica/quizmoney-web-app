import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationObject {
  content: Content[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface Content {
  body: string;
  opened: boolean;
  message: string;
  id: string;
}
interface NotificationState {
  notifications: NotificationObject | null;
  notificationCount: number;
}
const initialState: NotificationState = {
  notifications: null,
  notificationCount: 0,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationObject>) {
      state.notifications = action.payload;
    },
    appendNotifications(state, action: PayloadAction<NotificationObject>) {
      const incoming = action.payload;
      if (!state.notifications) {
        state.notifications = incoming;
        return;
      }
      const existing = state.notifications;

      const seen = new Set(existing.content.map((n) => n.id));
      const merged = [
        ...existing.content,
        ...incoming.content.filter((n) => !seen.has(n.id)),
      ];

      state.notifications = {
        content: merged,
        pageNo: incoming.pageNo,
        pageSize: incoming.pageSize,
        totalElements: incoming.totalElements,
        totalPages: incoming.totalPages,
        last: incoming.last,
      };
    },
    setNotificationsCount(state, action: PayloadAction<number>) {
      state.notificationCount = action.payload;
    },
    clearNotifications(state) {
      state.notifications = null;
    },
  },
});

export const {
  setNotifications,
  appendNotifications,
  clearNotifications,
  setNotificationsCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
