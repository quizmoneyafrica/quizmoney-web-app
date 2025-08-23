import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const NotificationApi = {
  fetchNotificationsCount(): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      "notifications/count",
      {},
      {},
      "GET"
    );
  },
  fetchNotifications(page = 0, count = 10): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `notifications?page=${page}&count=${count}`,
      {},
      {},
      "GET"
    );
  },

  readNotification(id: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>(
      `notifications/${id}`,
      {},
      {},
      "GET"
    );
  },
};
export default NotificationApi;
