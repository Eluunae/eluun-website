// netlify/functions/discord-auth.js
exports.handler = async function(event, context) {
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

  const authURL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds.join`;
  
  console.log('Auth URL:', authURL); // Debug

  return {
    statusCode: 200,
    body: JSON.stringify({ url: authURL })
  };
};