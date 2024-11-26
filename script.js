// scripts.js

const clientId = '7d4fe1c6125c4a4b8d63d6f3b9f46ed7'; // Remplacez par votre client_id
const redirectUri = 'https://eluun.link/download'; // Remplacez par votre URI de redirection
const scopes = 'user-follow-modify user-library-modify'; // Scopes nécessaires

let currentUserId = '';
let currentTrackId = '';

function openModal(button) {
    currentUserId = button.getAttribute('data-user-id');
    currentTrackId = button.getAttribute('data-track-id');
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function connectSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    window.location.href = authUrl;
}

// Fonction pour récupérer le token d'accès depuis l'URL de redirection
function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
}

// Fonction pour suivre un utilisateur
function followUserSpotify(userId, accessToken) {
    fetch(`https://api.spotify.com/v1/me/following?type=user&ids=${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            console.log('User followed');
        } else {
            console.error('Failed to follow user');
        }
    });
}

// Fonction pour ajouter une musique aux favoris
function likeTrackSpotify(trackId, accessToken) {
    fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            console.log('Track liked');
        } else {
            console.error('Failed to like track');
        }
    });
}

// Fonction pour vérifier si l'utilisateur suit votre compte
function checkIfUserFollows(userId, accessToken) {
    fetch(`https://api.spotify.com/v1/me/following/contains?type=user&ids=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => response.json())
      .then(data => {
          if (data[0]) {
              console.log('User is following');
          } else {
              console.log('User is not following');
          }
      });
}

// Fonction pour vérifier si l'utilisateur a liké la musique
function checkIfTrackLiked(trackId, accessToken) {
    fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => response.json())
      .then(data => {
          if (data[0]) {
              console.log('Track is liked');
          } else {
              console.log('Track is not liked');
          }
      });
}

// Exemple d'utilisation après redirection
window.onload = function() {
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
        followUserSpotify(currentUserId, accessToken); // Utiliser l'ID utilisateur depuis le HTML
        likeTrackSpotify(currentTrackId, accessToken); // Utiliser l'ID de la piste depuis le HTML

        // Vérifier si l'utilisateur suit votre compte et a liké la musique
        checkIfUserFollows(currentUserId, accessToken);
        checkIfTrackLiked(currentTrackId, accessToken);
    }
};