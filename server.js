const express = require('express');
const app = express();
app.use(express.json());
let usersOnline = [];
const fs = require('fs');
let totalVisits = 0;
let knownVisitors = new Set();
// Legge counter.json all'avvio
try {
    const data = JSON.parse(fs.readFileSync('counter.json', 'utf-8'));
    totalVisits = data.totalVisits || 2000; // parte da 2000 se vuoto
    if (data.knownVisitors) knownVisitors = new Set(data.knownVisitors);
} catch (e) {
    console.log("File counter.json non trovato, parto da 2000");
    totalVisits = 2000;
}
app.post('/online', (req, res) => {
    const now = Date.now();
    const ip = req.ip;
    // Rimuove utenti inattivi da più di 60 secondi
    usersOnline = usersOnline.filter(u => now - u.time < 60000);

    // Aggiorna o aggiunge l'utente corrente
    const index = usersOnline.findIndex(u => u.ip === ip);
    if (index > -1) usersOnline[index].time = now;
    else {
        usersOnline.push({ ip, time: now });
        totalVisits++; // ogni nuovo visitatore incrementa il contatore globale
    }

    res.sendStatus(200);
});

app.get('/online', (req, res) => {
    const now = Date.now();
    usersOnline = usersOnline.filter(u => now - u.time < 60000);
    res.json({ online: usersOnline.length });
});

app.get('/count', (req, res) => {
    res.json({ totalVisits });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
