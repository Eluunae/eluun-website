// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  const discordButton = document.querySelector('.discord-button');
  if (discordButton) {
    discordButton.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/.netlify/functions/discord-auth');
        const data = await response.json();
        window.location.href = data.url;
      } catch (error) {
        console.error('Error:', error);
      }
    });
  }
});