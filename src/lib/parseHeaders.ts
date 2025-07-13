export const getParseHeaders = (accessToken?: string) => {
  return {
    // "X-Parse-Application-Id": process.env.X_PARSE_APP_ID!,
    // "X-Parse-REST-API-Key": process.env.X_PARSE_REST_API_KEY!,
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: accessToken }),
  };
};

export const getBaseUrl = () => {
  return process.env.X_BASE_URL!;
};
