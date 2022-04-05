import axios, { AxiosRequestConfig } from "axios";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { generateRandomString } from "./utils/generateRandomString";
import { spotifyRequestHelper } from "./utils/spotifyRequestHelper";
import { getSpotifyApiToken } from "./utils/getSpotifyApiToken";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI =
  process.env.REDIRECT_URI || "http://localhost:8888/callback";
const stateKey = "spotify_auth_state";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

const app = express();
app
  .use(express.static(path.join(__dirname, "../public")))
  .use(cors())
  .use(cookieParser());

app.get("/login", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = "user-read-private user-read-email user-top-read";
  const query = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectURI,
    state: state,
  });
  res.redirect("https://accounts.spotify.com/authorize?" + query.toString());
});

app.get("/callback", async (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    const query = new URLSearchParams({ error: "state_mismatch" });
    res.redirect("/#" + query.toString());
  } else {
    res.clearCookie(stateKey);
    try {
      const { accessToken, refreshToken, expiresIn, displayName } =
        await getSpotifyApiToken(
          clientId,
          clientSecret,
          code.toString(),
          redirectURI
        );

      const data = await spotifyRequestHelper(
        "GET",
        "https://api.spotify.com/v1/me",
        accessToken
      );

      const query = new URLSearchParams({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn,
        user: displayName,
      });
      res.redirect("/#" + query.toString());
    } catch (error) {
      const query = new URLSearchParams({ error: "invalid_token" });
      res.redirect("/#" + query.toString());
    }
  }
});

app.get("/refresh_token", (req, res) => {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions: AxiosRequestConfig = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    params: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
  };

  axios(authOptions)
    .then((response) => {
      const access_token = response.data.access_token;
      const expires_in = response.data.expires_in;
      const options: AxiosRequestConfig = {
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
        method: "GET",
      };
      axios(options).then((response) => {
        const query = new URLSearchParams({
          access_token: access_token,
          expires_in: expires_in,
          user: response.data.display_name,
        });
        res.redirect("/#" + query.toString());
      });
    })
    .catch((error) => {
      const query = new URLSearchParams({ error: "invalid_token" });
      console.error(error);
      res.redirect("/#" + query.toString());
    });
});

app.get("/me", async (req, res) => {
  const { accessToken } = req.query;
  const data = await spotifyRequestHelper("GET", "/me", accessToken.toString());
  res.send(data);
});

app.get("/me/top/tracks", async (req, res) => {
  const { accessToken } = req.query;
  const data = await spotifyRequestHelper(
    "GET",
    "me/top/tracks",
    accessToken.toString(),
    {
      limit: 50,
      time_range: "long_term",
    }
  );
  res.send(data);
});

app.get("/me/top/artists", async (req, res) => {
  const { accessToken } = req.query;
  const data = await spotifyRequestHelper(
    "GET",
    "me/top/artists",
    accessToken.toString(),
    { limit: 50, time_range: "long_term" }
  );
  res.send(data);
});

app.get("/me/playlists", async (req, res) => {
  const { accessToken } = req.query;
  const data = await spotifyRequestHelper(
    "GET",
    "https://api.spotify.com/v1/me/playlists",
    accessToken.toString(),
    { limit: 50 }
  );
  res.send(data);
});

console.log("Listening on 8888");
app.listen(8888);
