function toggleUserTopTracks() {
  const userTopTracks = document.getElementById("user-top-tracks");
  const userTopTracksButton = document.getElementById("user-top-tracks-toggle");
  if (userTopTracks.style.display === "none") {
    userTopTracks.style.display = "block";
    userTopTracksButton.textContent = "Hide Top Tracks";
  } else {
    userTopTracks.style.display = "none";
    userTopTracksButton.textContent = "View Top Tracks";
  }
}

function toggleUserTopArtists() {
  const userTopArtists = document.getElementById("user-top-artists");
  const userTopArtistsButton = document.getElementById(
    "user-top-artists-toggle"
  );
  if (userTopArtists.style.display === "none") {
    userTopArtists.style.display = "block";
    userTopArtistsButton.textContent = "Hide Top Artists";
  } else {
    userTopArtists.style.display = "none";
    userTopArtistsButton.textContent = "View Top Artists";
  }
}

function toggleUserPlaylists() {
  const userPlaylists = document.getElementById("user-playlists");
  const userPlaylistsButton = document.getElementById("user-playlists-toggle");
  if (userPlaylists.style.display === "none") {
    userPlaylists.style.display = "block";
    userPlaylistsButton.textContent = "Hide Playlists";
  } else {
    userPlaylists.style.display = "none";
    userPlaylistsButton.textContent = "View Playlists";
  }
}
