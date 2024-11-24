exports.handler = async (event) => {
  // Import dynamique de node-fetch
  const fetch = (await import('node-fetch')).default;

  // Parse les données envoyées par le formulaire
  const body = JSON.parse(event.body);
  const phone = body.phone;
  const consent = body.consent;

  console.log('Phone:', phone);
  console.log('Consent:', consent);

  // Vous pouvez maintenant faire appel à l'API ou effectuer une autre logique
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BREVO_API_KEY}`,  // Assurez-vous que votre clé API est dans .env
      },
      body: JSON.stringify({
        listIds: [5],  // Liste à laquelle ajouter ce contact
        attributes: {
          PHONE: phone,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // Si l'API retourne une erreur
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Failed to add contact', error: data }),
      };
    }

    // Si tout va bien
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact added successfully', data }),
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error }),
    };
  }
};
