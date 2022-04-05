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

  /**
   * Creeates a new template and placeholder
   * @param {string} key - The prefix of the returned object properties
   * @param {string} templateID - ID of the template
   * @param {string} placeholderID - ID of the placeholder
   * @returns {object} - Object with the template and placeholder
   */
  function createTemplate(key, templateID, placeHolderID) {
    var source = document.getElementById(templateID).innerHTML;
    var template = Handlebars.compile(source);
    var placeholder = document.getElementById(placeHolderID);
    const templateKey = `${key}Template`;
    const placeHolderKey = `${key}Placeholder`;
    return {
      [templateKey]: template,
      [placeHolderKey]: placeholder,
    };
  }

  /**
   *
   * @param {string} url - The url to fetch
   * @param {object} template - The template be filled with the response data
   * @param {object} placeHolder - The placeholder to insert the template
   */
  function updatePlaceHolder(url, template, placeHolder) {
    $.ajax({
      url: url,
      crossDomain: true,
      success: function (response) {
        placeHolder.innerHTML = template(response);
      },
    });
  }

  var { oauthTemplate, oauthPlaceholder } = createTemplate(
    "oauth",
    "oauth-template",
    "oauth"
  );
  var { userProfileTemplate, userProfilePlaceholder } = createTemplate(
    "userProfile",
    "user-profile-template",
    "user-profile"
  );
  var { userTopTracksTemplate, userTopTracksPlaceholder } = createTemplate(
    "userTopTracks",
    "user-top-tracks-template",
    "user-top-tracks"
  );
  var { userTopArtistsTemplate, userTopArtistsPlaceholder } = createTemplate(
    "userTopArtists",
    "user-top-artists-template",
    "user-top-artists"
  );
  var { userPlaylistsTemplate, userPlaylistsPlaceholder } = createTemplate(
    "userPlaylists",
    "user-playlists-template",
    "user-playlists"
  );

  var params = getHashParams();

  var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

  if (error) {
    alert("There was an error during the authentication");
  } else {
    if (access_token) {
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token,
      });
      const query = new URLSearchParams({ access_token: access_token });
      updatePlaceHolder(
        "/me?" + query.toString(),
        userProfileTemplate,
        userProfilePlaceholder
      );
      updatePlaceHolder(
        "/me/top/tracks?" + query.toString(),
        userTopTracksTemplate,
        userTopTracksPlaceholder
      );
      updatePlaceHolder(
        "/me/top/artists?" + query.toString(),
        userTopArtistsTemplate,
        userTopArtistsPlaceholder
      );
      updatePlaceHolder(
        "/me/playlists?" + query.toString(),
        userPlaylistsTemplate,
        userPlaylistsPlaceholder
      );
      $("#login").hide();
      $("#loggedin").show();
    } else {
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
