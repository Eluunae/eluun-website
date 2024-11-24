// Logique pour la soumission du formulaire (mise à jour avec l'intégration Netlify Functions)
document.getElementById("smsForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire

    const phone = document.getElementById('phone').value;
    const consent = document.getElementById('consent').checked;

    // Vérifier si le numéro est valide et si le consentement est donné
    if (consent && phone.startsWith('+')) {
        fetch('/.netlify/functions/add-contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone, consent })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Contact ajouté:', data);
            alert('Vous vous êtes abonné avec succès!');
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout du contact:', error);
            alert('Échec de l\'abonnement. Veuillez réessayer plus tard.');
        });
    } else {
        alert('Veuillez fournir un numéro valide et donner votre consentement pour vous abonner.');
    }
});

// Logique pour le téléchargement (simplifiée pour maintenant)
document.getElementById("downloadButton").addEventListener("click", function() {
    alert("Téléchargement en attente de validation via Spotify/SoundCloud.");
    // Vous pourrez ajouter la logique API plus tard ici
});
