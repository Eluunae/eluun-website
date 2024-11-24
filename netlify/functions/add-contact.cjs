const SibApiV3Sdk = require('sib-api-v3-sdk');

exports.handler = async (event) => {
  // Configure le client avec ta clé API
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;  // Assure-toi que ta clé API est dans .env

  // Créer l'instance de l'API Contacts
  let apiInstance = new SibApiV3Sdk.ContactsApi();

  // Récupérer les données envoyées par le formulaire
  const body = JSON.parse(event.body);
  const phone = body.phone; // Le téléphone doit être dans le bon format international
  const consent = body.consent;

  console.log('Phone:', phone);
  console.log('Consent:', consent);

  // Créer un contact
  let createContact = new SibApiV3Sdk.CreateContact();
  createContact.email = 'example@example.com'; // Remplace si nécessaire
  createContact.listIds = [5];  // Liste à laquelle ajouter ce contact

  // Ici, on met le téléphone sous l'attribut SMS comme conseillé
  createContact.attributes = {
    SMS: phone,  // Format : "+33 6 00 00 00 00" par exemple
  };

  // Appel de l'API pour créer le contact
  try {
    const data = await apiInstance.createContact(createContact);
    console.log('API called successfully. Contact added:', data);

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
