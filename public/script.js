(function () {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById(
      "user-profile-template"
    ).innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById("user-profile");

  var oauthSource = document.getElementById("oauth-template").innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById("oauth");

  var userTopTracksSource = document.getElementById(
      "user-top-tracks-template"
    ).innerHTML,
    userTopTracksTemplate = Handlebars.compile(userTopTracksSource),
    userTopTracksPlaceholder = document.getElementById("user-top-tracks");

  var userTopArtistsSource = document.getElementById(
      "user-top-artists-template"
    ).innerHTML,
    userTopArtistsTemplate = Handlebars.compile(userTopArtistsSource),
    userTopArtistsPlaceholder = document.getElementById("user-top-artists");

  var userPlaylists = document.getElementById(
      "user-playlists-template"
    ).innerHTML,
    userPlaylistsTemplate = Handlebars.compile(userPlaylists),
    userPlaylistsPlaceholder = document.getElementById("user-playlists");

  var params = getHashParams();

  var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  if (error) {
    alert("There was an error during the authentication");
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token,
      });
      const query = new URLSearchParams({ access_token: access_token });
      $.ajax({
        url: "http://localhost:8888/me?" + query.toString(),
        crossDomain: true,
        success: function (response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);
          $("#login").hide();
          $("#loggedin").show();
        },
      });
      // get me/top/tracks
      $.ajax({
        url: "http://localhost:8888/me/top/tracks?" + query.toString(),
        crossDomain: true,
        success: function (response) {
          userTopTracksPlaceholder.innerHTML = userTopTracksTemplate(response);
          $("#login").hide();
          $("#loggedin").show();
        },
      });
      // get me/top/artists
      $.ajax({
        url: "http://localhost:8888/me/top/artists?" + query.toString(),
        crossDomain: true,
        success: function (response) {
          userTopArtistsPlaceholder.innerHTML =
            userTopArtistsTemplate(response);
          $("#login").hide();
          $("#loggedin").show();
        },
      });
      // get me/playlists
      $.ajax({
        url: "http://localhost:8888/me/playlists?" + query.toString(),
        crossDomain: true,
        success: function (response) {
          userPlaylistsPlaceholder.innerHTML = userPlaylistsTemplate(response);
          $("#login").hide();
          $("#loggedin").show();
        },
      });
    } else {
      // render initial screen
      $("#login").show();
      $("#loggedin").hide();
    }

    document.getElementById("obtain-new-token").addEventListener(
      "click",
      function () {
        $.ajax({
          url: "/refresh_token",
          data: {
            refresh_token: refresh_token,
          },
          crossDomain: true,
        }).done(function (data) {
          access_token = data.access_token;
          oauthPlaceholder.innerHTML = oauthTemplate({
            access_token: access_token,
            refresh_token: refresh_token,
          });
        });
      },
      false
    );
  }
})();
