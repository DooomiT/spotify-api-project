import axios, { AxiosRequestConfig } from "axios";

export async function getSpotifyApiToken(
  clientId: string,
  clientSecret: string,
  code: String,
  redirectURI: string
) {
  const authOptions: AxiosRequestConfig = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    params: {
      code: code,
      redirect_uri: redirectURI,
      grant_type: "authorization_code",
    },
  };
  const response = await axios(authOptions);
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
    displayName: response.data.display_name,
  };
}
