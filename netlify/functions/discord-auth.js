// netlify/functions/discord-auth.js
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

exports.handler = async function(event, context) {
  const authURL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${DISCORD_REDIRECT_URI}&response_type=code&scope=identify%20guilds.join`;
  
  return {
    statusCode: 302,
    headers: {
      Location: authURL,
    }
  };
};