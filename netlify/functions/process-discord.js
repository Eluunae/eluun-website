// netlify/functions/process-discord.js
const axios = require('axios');

exports.handler = async function(event) {
  console.log('1. Début de process-discord');
  
  try {
    const { code } = JSON.parse(event.body);
    console.log('2. Code reçu:', code);

    // 1. Obtenir le token
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

    console.log('Token obtenu');

    // 2. Obtenir les informations de l'utilisateur
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`
      }
    });

    console.log('Info utilisateur:', userResponse.data.id);

    // 3. Ajouter l'utilisateur au serveur avec le rôle
    await axios.put(
      `https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${userResponse.data.id}`,
      {
        access_token: tokenResponse.data.access_token,
        roles: [process.env.DISCORD_ROLE_ID]
      },
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Après l'ajout du rôle réussi
    console.log('5. Utilisateur ajouté avec rôle');
    
    // Redirection vers la page d'accueil avec paramètre success
    return {
      statusCode: 302,
      headers: {
        'Location': 'https://eluun.link?success=true',
        'Cache-Control': 'no-cache'
      }
    };

  } catch (error) {
    console.error('Erreur détaillée:', error.response?.data || error);
    return {
      statusCode: 500,
      headers: {
        'Location': 'https://eluun.link?error=true'
      }
    };
  }
  
};