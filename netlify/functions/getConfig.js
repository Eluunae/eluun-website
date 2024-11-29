// netlify/functions/getConfig.js
exports.handler = async function() {
  if (!process.env.DISCORD_CLIENT_ID) {
    console.error('DISCORD_CLIENT_ID not set');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuration error' })
    };
  }

  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify({
        clientId: process.env.DISCORD_CLIENT_ID,
        redirectUri: 'https://eluun.link/callback'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};