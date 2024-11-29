// netlify/functions/discord-auth.js
exports.handler = async function() {
  const authURL = "https://discord.com/oauth2/authorize?client_id=1311976301351014442&response_type=code&redirect_uri=https%3A%2F%2Feluun.link&scope=identify+guilds.join";
  
  return {
    statusCode: 302,
    headers: {
      Location: authURL
    }
  };
};