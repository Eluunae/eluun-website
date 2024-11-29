const fetch = require('node-fetch');

// netlify/functions/discord-auth.js
exports.handler = async function(event, context) {
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const currentDomain = event.headers.host;
  const DISCORD_REDIRECT_URI = `https://${currentDomain}/.netlify/functions/discord-callback`;

  console.log('Redirect URI:', DISCORD_REDIRECT_URI); // Debug log

  const authURL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify%20guilds.join`;

  return {
    statusCode: 302,
    headers: {
      Location: authURL
    }
  };
};

exports.handler = async function(event, context) {
  // Log pour debug
  console.log('Callback called with code:', event.queryStringParameters.code);

  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const DISCORD_REDIRECT_URI = "https://eluun.link/.netlify/functions/discord-callback";
  const GUILD_ID = process.env.DISCORD_GUILD_ID;
  const ROLE_ID = process.env.DISCORD_ROLE_ID;

  try {
    // 1. Échanger le code contre un token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: event.queryStringParameters.code,
        redirect_uri: DISCORD_REDIRECT_URI,
      })
    });

    const tokenData = await tokenResponse.json();
    console.log('Token received:', tokenData);

    // 2. Obtenir les infos de l'utilisateur
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });
    const userData = await userResponse.json();
    console.log('User data:', userData);

    // 3. Ajouter le rôle
    const addRoleResponse = await fetch(
      `https://discord.com/api/guilds/${GUILD_ID}/members/${userData.id}/roles/${ROLE_ID}`, 
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 4. Redirection finale
    return {
      statusCode: 302,
      headers: {
        Location: 'https://eluun.link'
      }
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};