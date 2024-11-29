// netlify/functions/process-discord.js
const axios = require('axios');

exports.handler = async function(event) {
  console.log('Body reçu:', event.body);
  
  try {
    const { code } = JSON.parse(event.body);
    console.log('Code extrait:', code);

    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Code manquant' })
      };
    }

    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://eluun.link'
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    console.log('Token response:', tokenResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true,
        message: 'Token obtenu avec succès'
      })
    };

  } catch (error) {
    console.error('Erreur complète:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response?.data 
      })
    };
  }
};