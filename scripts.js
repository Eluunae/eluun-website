// Logique pour la soumission du formulaire (exemple)
document.getElementById("smsForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche la soumission du formulaire
    
    let phoneNumber = document.getElementById("phone").value;
    
    if (phoneNumber) {
        alert("Numéro ajouté pour la campagne SMS !");
        // Ici, vous pourrez ajouter du code pour envoyer le numéro via une API
    }
});

// Logique pour le téléchargement (simplifiée pour maintenant)
document.getElementById("downloadButton").addEventListener("click", function() {
    alert("Téléchargement en attente de validation via Spotify/SoundCloud.");
    // Vous pourrez ajouter la logique API plus tard ici
});
/* Style du lien pour le bouton */
.button-link {
    display: inline-block;
    background-color: #4CAF50;
    color: white;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 20px;
}

.button-link:hover {
    background-color: #45a049;
}
