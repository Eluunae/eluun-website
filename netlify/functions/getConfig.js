// netlify/functions/getConfig.js
exports.handler = async function() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      clientId: process.env.DISCORD_CLIENT_ID,
      redirectUri: 'https://eluun.link/callback' // URL fixe ou process.env.REDIRECT_URI
    })
  };
};