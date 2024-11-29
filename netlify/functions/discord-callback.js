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

// netlify/functions/discord-callback.js
const fetch = require('node-fetch');

const handler = async (event) => {
  const code = event.queryStringParameters.code;
  
  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No code provided' })
    };
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://eluun.link/.netlify/functions/discord-callback'
      })
    });

    const tokenData = await tokenResponse.json();
    
    await fetch(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${tokenData.user.id}/roles/${process.env.DISCORD_ROLE_ID}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      statusCode: 302,
      headers: {
        'Location': 'https://eluun.link'
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

module.exports = { handler };