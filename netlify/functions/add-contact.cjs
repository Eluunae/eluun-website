// netlify/functions/add-contact.js
import fetch from 'node-fetch'; // Vous aurez besoin de `node-fetch` pour faire des requêtes API
const apiKey = process.env.BREVO_API_KEY; // Utilisez une variable d'environnement pour sécuriser la clé API

exports.handler = async (event) => {
  // Si ce n'est pas une requête POST, retournez une erreur
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  // Extraire les données envoyées dans le body de la requête
  const { phone, consent } = JSON.parse(event.body);

  // Vérifiez que les données sont présentes
  if (!phone || !consent) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Phone number and consent are required' })
    };
  }

  // Exemple de requête pour ajouter un contact via l'API Brevo
  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey // Utilisation de la clé API Brevo
    },
    body: JSON.stringify({
      email: '', // Vous pouvez ajouter une adresse email si vous le souhaitez
      attributes: { PHONE: phone },
      listIds: [Telephone],/* Liste d'ID à laquelle ajouter ce contact */
    })
  });

  // Vérifiez la réponse de l'API de Brevo
  if (!response.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add contact' })
    };
  }

  // Répondre avec un succès
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Contact added successfully' })
  };
};
