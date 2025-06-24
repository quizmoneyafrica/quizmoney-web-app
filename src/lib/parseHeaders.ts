export const getParseHeaders = (sessionToken?: string) => {
  return {
    "X-Parse-Application-Id": process.env.X_PARSE_APP_ID!,
    "X-Parse-REST-API-Key": process.env.X_PARSE_REST_API_KEY!,
    "Content-Type": "application/json",
    ...(sessionToken && { "X-Parse-Session-Token": sessionToken }),
  };
};

export const getBaseUrl = () => {
  return process.env.X_BASE_URL!;
};
