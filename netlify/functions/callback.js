const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const code = event.queryStringParameters.code;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const botToken = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.GUILD_ID;
  const roleId = process.env.ROLE_ID;
  const redirectUri = 'https://eluun.link/callback';

  try {
    // Échanger le code contre un token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        scope: 'identify guilds.join'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const tokenData = await tokenResponse.json();
    
    // Récupérer les informations de l'utilisateur
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });
    
    const userData = await userResponse.json();

    // Ajouter l'utilisateur au serveur avec le rôle
    await fetch(`https://discord.com/api/guilds/${guildId}/members/${userData.id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        access_token: tokenData.access_token,
        roles: [roleId]
      })
    });

    return {
      statusCode: 302,
      headers: {
        Location: 'https://eluun.link' // Redirection vers votre site
      }
    };
  } catch (error) {
    console.error('Auth Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Authentication failed' })
    };
  }
};