// functions/add-contact.js

const axios = require('axios'); // Assurez-vous que Axios est bien installé (voir ci-dessous)
require('dotenv').config(); // Pour charger des variables d'environnement (clé API)

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { phone, consent } = JSON.parse(event.body);

    if (!phone || !consent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Phone number and consent are required.' })
      };
    }

    try {
      // Utilisation de l'API de Brevo pour ajouter le contact
      const response = await axios.post('https://api.brevo.com/v3/contacts', {
        attributes: {
          SMS: phone, // Utilisation du champ SMS pour le numéro de téléphone
        },
        listIds: ['YOUR_LIST_ID'], // Remplacez par l'ID de votre liste
        updateEnabled: true
      }, {
        headers: {
          'api-key': process.env.BREVO_API_KEY // Utilisez votre clé API de Brevo
        }
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Contact added successfully', data: response.data })
      };
    } catch (error) {
      console.error('Error adding contact:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to add contact to Brevo.' })
      };
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
};
