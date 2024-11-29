const fetch = require('node-fetch');

const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  DISCORD_GUILD_ID,
  DISCORD_ROLE_ID
} = process.env;

exports.handler = async function(event, context) {
  const code = event.queryStringParameters.code;
  
  try {
    // Échanger le code contre un token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: DISCORD_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    // Ajouter l'utilisateur au serveur avec le rôle
    await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/members/${tokenData.user.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: tokenData.access_token,
        roles: [DISCORD_ROLE_ID]
      }),
    });

    return {
      statusCode: 302,
      headers: {
        Location: '/', // Redirection vers la page d'accueil après succès
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to authenticate with Discord' }),
    };
  }
};