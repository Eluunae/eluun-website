// netlify/functions/discord-auth.js
exports.handler = async function(event, context) {
  // Utiliser directement l'URL générée par Discord
  const authURL = "https://discord.com/oauth2/authorize?client_id=1311976301351014442&response_type=code&redirect_uri=https%3A%2F%2Feluun.link%2F.netlify%2Ffunctions%2Fdiscord-callback&scope=identify+guilds.join";

  return {
    statusCode: 302,
    headers: {
      Location: authURL
    }
  };
};