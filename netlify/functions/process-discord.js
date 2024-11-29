// netlify/functions/process-discord.js
const fetch = require('node-fetch');

exports.handler = async function(event) {
  const { code } = JSON.parse(event.body);
  
  try {
    // 1. Échanger le code contre un token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://eluun.link'
      })
    });

    const tokenData = await tokenResponse.json();

    // 2. Ajouter au serveur avec le rôle
    await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${tokenData.user.id}/roles/${process.env.DISCORD_ROLE_ID}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};