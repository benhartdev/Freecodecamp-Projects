const express = require('express');
const app = express();
const path = require('path');

// Servez vos fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Route par défaut
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Démarrer le serveur
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});