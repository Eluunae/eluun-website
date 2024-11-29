// public/js/discord-handler.js
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si on a un code dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    // Appeler notre fonction callback avec le code
    fetch('/.netlify/functions/discord-callback', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Role added successfully:', data);
      // Rediriger vers la page d'accueil sans le code
      window.location.href = '/';
    })
    .catch(error => console.error('Error:', error));
  }
});