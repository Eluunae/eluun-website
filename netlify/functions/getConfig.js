// netlify/functions/getConfig.js
exports.handler = async function() {
  console.log('getConfig called');
  try {
    if (!process.env.DISCORD_CLIENT_ID) {
      throw new Error('Missing DISCORD_CLIENT_ID');
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        clientId: process.env.DISCORD_CLIENT_ID,
        redirectUri: 'https://eluun.link/callback'
      })
    };
  } catch (error) {
    console.error('getConfig error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};