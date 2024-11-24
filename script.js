console.log('Script chargé');
// Logique pour la soumission du formulaire (mise à jour avec l'intégration Netlify Functions)
document.getElementById('phone-form').addEventListener('submit', function(event) {
    event.preventDefault();

    console.log('Form submitted'); // Ajoutez ceci pour vérifier si l'événement de soumission est déclenché.

    const phone = document.getElementById('phone').value;
    const consent = document.getElementById('consent').checked;

    if (consent && phone.startsWith('+')) {
        console.log('Phone:', phone); // Vérifiez si les valeurs sont correctes.
        console.log('Consent:', consent);

        fetch('/.netlify/functions/add-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, consent }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data); // Vérifiez ce que retourne le serveur.
            alert('You have successfully subscribed!');
        })
        .catch(error => {
            console.error('Error adding contact:', error);
            alert('Failed to subscribe. Please try again later.');
        });
    } else {
        alert('Please provide a valid phone number and consent to subscribe.');
    }
});

