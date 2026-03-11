const express = require('express');
const app = express();
app.use(express.json());

let usersOnline = [];
let totalVisits = 2000; // parte da 200
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
