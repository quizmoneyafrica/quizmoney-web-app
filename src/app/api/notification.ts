import { ApiResponse } from "./interface";
import { callWithSessionToken } from "./parse/callWithSessionToken";

const NotificationApi = {
  fetchNotifications(): Promise<ApiResponse> {
    // return callWithSessionToken<ApiResponse>("getNotifications");
    // return;
  },

  readNotification(notificationId: string): Promise<ApiResponse> {
    return callWithSessionToken<ApiResponse>("readNotification", {
      notificationId,
    });
  },
};
export default NotificationApi;
