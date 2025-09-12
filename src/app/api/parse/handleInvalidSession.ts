import {
  logout,
  updateAccessToken,
  updateExpiry,
  updateRefreshToken,
} from "@/app/store/authSlice";
import { AppDispatch, persistor } from "@/app/store/store";
import { setTransactions, setWallet } from "@/app/store/walletSlice";
import {
  getRefreshPromise,
  setRefreshPromise,
} from "@/app/utils/refreshTokenPromise";

// Types for better type safety
interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiredAt: string;
}

interface RefreshResponse {
  data: TokenData;
}

interface ErrorResponse {
  message: string;
  statusCode?: number;
}

// Constants for better maintainability
const REFRESH_ENDPOINT = "/api/refresh";
const SESSION_EXPIRED_MESSAGE = "Session expired";

/**
 * Clears user session data from store and persistor
 */
const clearUserSession = async (dispatch: AppDispatch): Promise<void> => {
  dispatch(logout());
  dispatch(setWallet([]));
  dispatch(setTransactions([]));
  await persistor.purge();
};

/**
 * Validates token data response
 */
interface ValidateTokenDataInput {
  accessToken?: string;
  refreshToken?: string;
  expiredAt?: string;
}

const validateTokenData = (
  tokenData: ValidateTokenDataInput
): tokenData is TokenData => {
  return (
    tokenData &&
    typeof tokenData.accessToken === "string" &&
    typeof tokenData.refreshToken === "string" &&
    typeof tokenData.expiredAt === "string" &&
    tokenData.accessToken.length > 0 &&
    tokenData.refreshToken.length > 0
  );
};

/**
 * Handles API error responses
 */
const handleApiError = async (
  response: Response,
  dispatch: AppDispatch
): Promise<never> => {
  let errorData: ErrorResponse;
  
  try {
    const errorText = await response.text();
    errorData = errorText ? JSON.parse(errorText) : { message: "Unknown error" };
  } catch {
    errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
  }

  // Handle session expiration
  if (errorData.message === SESSION_EXPIRED_MESSAGE || response.status === 401) {
    await clearUserSession(dispatch);
    throw new Error(SESSION_EXPIRED_MESSAGE);
  }

  throw new Error(errorData.message || "Failed to refresh token");
};

/**
 * Makes refresh token API request
 */
const refreshTokenRequest = async (
  refreshToken: string,
  dispatch: AppDispatch
): Promise<TokenData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(REFRESH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokenValue: refreshToken }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      await handleApiError(response, dispatch);
    }

    const data: RefreshResponse = await response.json();
    
    if (!validateTokenData(data?.data)) {
      throw new Error("Invalid token data received from server");
    }

    return data.data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout: Server took too long to respond");
    }
    
    throw error;
  }
};

/**
 * Optimized session handler with improved error handling and deduplication
 */
export const handleInvalidSession = async (
  dispatch: AppDispatch,
  refreshToken?: string
): Promise<string> => {
  // Return existing promise if one is already in progress
  const existingPromise = getRefreshPromise();
  if (existingPromise) {
    return existingPromise;
  }

  // Validate input
  if (!refreshToken?.trim()) {
    throw new Error("No valid refresh token provided");
  }

  const refreshPromise = (async (): Promise<string> => {
    try {
      const tokenData = await refreshTokenRequest(refreshToken, dispatch);

      console.log('==============refreshTokenRequest======================');
      console.log(JSON.stringify({
        previousRefreshToken: refreshToken,
        newRefreshToken: tokenData.refreshToken,
        expiredAt: tokenData.expiredAt,
        timestamp: new Date().toISOString()
      }, null, 2));
      console.log('============refreshTokenRequest========================');

      // Update store with new tokens
      dispatch(updateAccessToken(tokenData.accessToken));
      dispatch(updateRefreshToken(tokenData.refreshToken));
      dispatch(updateExpiry(Date.parse(tokenData.expiredAt)));

      return tokenData.accessToken;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.log("Token refresh failed:", JSON.stringify({ error: errorMessage, timestamp: new Date().toISOString(), refreshToken }, null, 2));
      throw error;
    } finally {
      // Always clear the promise when done
      setRefreshPromise(null);
    }
  })();

  // Cache the promise to prevent multiple concurrent requests
  setRefreshPromise(refreshPromise);
  return refreshPromise;
};
