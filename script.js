// scripts.js

const clientId = '7d4fe1c6125c4a4b8d63d6f3b9f46ed7'; // Remplacez par votre client_id
const redirectUri = 'https://eluun.link/download'; // Remplacez par votre URI de redirection
const scopes = 'user-follow-modify user-library-modify user-follow-read user-library-read'; // Scopes nécessaires

let currentUserId = '';
let currentTrackId = '';
let currentAudioUrl = '';

function openModal(button) {
    currentUserId = button.getAttribute('data-user-id');
    currentTrackId = button.getAttribute('data-track-id');
    currentAudioUrl = button.getAttribute('data-audio-url');
    console.log('openModal:', { currentUserId, currentTrackId, currentAudioUrl });

    // Stocker les valeurs dans le stockage local
    localStorage.setItem('currentUserId', currentUserId);
    localStorage.setItem('currentTrackId', currentTrackId);
    localStorage.setItem('currentAudioUrl', currentAudioUrl);

    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function connectSpotify() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    console.log('connectSpotify:', authUrl);
    window.location.href = authUrl;
}

// Fonction pour récupérer le token d'accès depuis l'URL de redirection
function getAccessTokenFromUrl() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    console.log('getAccessTokenFromUrl:', accessToken);
    return accessToken;
}

// Fonction pour suivre un utilisateur
function followUserSpotify(userId, accessToken) {
    return fetch(`https://api.spotify.com/v1/me/following?type=user&ids=${userId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            console.log('User followed');
            return true;
        } else {
            console.error('Failed to follow user');
            return false;
        }
    });
}

// Fonction pour ajouter une musique aux favoris
function likeTrackSpotify(trackId, accessToken) {
    return fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => {
        if (response.ok) {
            console.log('Track liked');
            return true;
        } else {
            console.error('Failed to like track');
            return false;
        }
    });
}

// Fonction pour vérifier si l'utilisateur suit votre compte
function checkIfUserFollows(userId, accessToken) {
    console.log('checkIfUserFollows: Checking userId', userId);
    return fetch(`https://api.spotify.com/v1/me/following/contains?type=user&ids=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => response.json())
      .then(data => {
          if (data[0]) {
              console.log('checkIfUserFollows: User is following');
              return true;
          } else {
              console.log('checkIfUserFollows: User is not following');
              return false;
          }
      });
}

// Fonction pour vérifier si l'utilisateur a liké la musique
function checkIfTrackLiked(trackId, accessToken) {
    console.log('checkIfTrackLiked: Checking trackId', trackId);
    return fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(response => response.json())
      .then(data => {
          if (data[0]) {
              console.log('checkIfTrackLiked: Track is liked');
              return true;
          } else {
              console.log('checkIfTrackLiked: Track is not liked');
              return false;
          }
      });
}

// Fonction pour télécharger le fichier
function downloadFile(url) {
    console.log('downloadFile:', url);
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Exemple d'utilisation après redirection
window.onload = async function() {
    const accessToken = getAccessTokenFromUrl();
    if (accessToken) {
        // Récupérer les valeurs depuis le stockage local
        currentUserId = localStorage.getItem('currentUserId');
        currentTrackId = localStorage.getItem('currentTrackId');
        currentAudioUrl = localStorage.getItem('currentAudioUrl');

        console.log('window.onload: currentUserId', currentUserId);
        console.log('window.onload: currentTrackId', currentTrackId);

        // Suivre l'utilisateur et liker la musique
        await followUserSpotify(currentUserId, accessToken);
        await likeTrackSpotify(currentTrackId, accessToken);

        // Attendre un délai pour s'assurer que les actions sont prises en compte
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Vérifier si l'utilisateur suit l'artiste et a liké la musique de manière générale
        const userFollowed = await checkIfUserFollows(currentUserId, accessToken);
        const trackLiked = await checkIfTrackLiked(currentTrackId, accessToken);

        console.log('window.onload:', { userFollowed, trackLiked });

        if (userFollowed && trackLiked) {
            document.getElementById('modal').style.display = 'block';
            document.querySelector('.spotify-button').innerHTML += ' ✔';
            const downloadButton = document.createElement('button');
            downloadButton.className = 'download-button';
            downloadButton.innerText = 'Télécharger';
            downloadButton.onclick = function() {
                downloadFile(currentAudioUrl);
            };
            document.querySelector('.modal-content').appendChild(downloadButton);
        } else {
            console.log('Conditions non remplies pour le téléchargement');
        }
    }
};