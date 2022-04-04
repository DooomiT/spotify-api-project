import axios, { AxiosRequestConfig } from 'axios';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express'
import path from 'path';

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectURI = process.env.REDIRECT_URI || 'http://localhost:8888/callback'
const stateKey = 'spotify_auth_state';

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 const generateRandomString = function(length: number) {
  var text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const app = express()
app.use(express.static(path.join(__dirname,'../public')))
  .use(cors())
  .use(cookieParser());


app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);
  
  // your application requests authorization
  const scope = 'user-read-private user-read-email user-top-read';
  const query = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectURI,
    state: state
  })
  res.redirect('https://accounts.spotify.com/authorize?' +  query.toString());
});

app.get('/callback', (req, res) => {
  // your application requests refresh and access tokens
  // after checking the state parameter
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  
  if (state === null || state !== storedState) {
    const query = new URLSearchParams({error: 'state_mismatch'})
    res.redirect('/#' + query.toString());

  } else {
    res.clearCookie(stateKey);
    const authOptions: AxiosRequestConfig = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
      },
      params: {
        code: code,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code'
      },
    };

    axios(authOptions).then(response => {
      const access_token = response.data.access_token;
      const refresh_token = response.data.refresh_token;
      const expires_in = response.data.expires_in;
      const options : AxiosRequestConfig= {
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        method: 'GET'
      }
      axios(options).then(response => {
        const query = new URLSearchParams({
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in: expires_in,
          user: response.data.display_name
        })
        res.redirect('/#' + query.toString());
      })
    }).catch(error => {
      const query = new URLSearchParams({error: 'invalid_token'})
      console.error(error)
      res.redirect('/#' + query.toString());
    })
  }
});

app.get('/refresh_token', (req, res) => {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions: AxiosRequestConfig = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
    },
    params: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }
  };

  axios(authOptions).then(response => {
    const access_token = response.data.access_token;
    const expires_in = response.data.expires_in;
    const options : AxiosRequestConfig= {
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      method: 'GET'
    }
    axios(options).then(response => {
      const query = new URLSearchParams({
        access_token: access_token,
        expires_in: expires_in,
        user: response.data.display_name
      })
      res.redirect('/#' + query.toString());
    })
  }).catch(error => {
    const query = new URLSearchParams({error: 'invalid_token'})
    console.error(error)
    res.redirect('/#' + query.toString());
  })
});

app.get('/me', (req, res) => {
  const {access_token} = req.query;
  const options : AxiosRequestConfig= {
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    method: 'GET'
  }
  axios(options).then(response => {
    res.send(response.data)
  })
})

app.get('/me/top/tracks', (req, res) => {
  const {access_token} = req.query;
  const options : AxiosRequestConfig= {
    url: 'https://api.spotify.com/v1/me/top/tracks',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    params: {
      limit: 50,
      time_range: 'long_term'
      },
      method: 'GET'
  }
  axios(options).then(response => {
    res.send(response.data)
  })
})

app.get('/me/top/artists', (req, res) => {
  const {access_token} = req.query;
  const options : AxiosRequestConfig= {
    url: 'https://api.spotify.com/v1/me/top/artists',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    params: {
      limit: 50,
      time_range: 'long_term'
      },
      method: 'GET'
  }
  axios(options).then(response => {
    res.send(response.data)
  })
})        

console.log('Listening on 8888');
app.listen(8888);