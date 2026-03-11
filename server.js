const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
app.use(cors()); 
app.use(express.json());
let usersOnline = [];
let totalVisits = 2000; // parte da 2000
let knownVisitors = new Set();
// Legge counter.json all'avvio
try {
    const data = JSON.parse(fs.readFileSync('counter.json', 'utf-8'));
    totalVisits = data.totalVisits || 2000;
    if (data.knownVisitors) knownVisitors = new Set(data.knownVisitors);
} catch (e) {
    console.log("File counter.json non trovato, parto da 2000");
}
// Salva counter.json
function saveCounter() {
    fs.writeFileSync('counter.json', JSON.stringify({
        totalVisits,
        knownVisitors: Array.from(knownVisitors)
    }));
}
app.post('/online', (req, res) => {
    const now = Date.now();
    const id = req.body.id;
    usersOnline = usersOnline.filter(u => now - u.time < 60000);
    const index = usersOnline.findIndex(u => u.id === id);
    if (index > -1) {
        usersOnline[index].time = now;
    } else {
        usersOnline.push({ id, time: now });
        if (!knownVisitors.has(id)) {
            knownVisitors.add(id);
            totalVisits++;
            saveCounter();
        }
    }
    res.sendStatus(200);
});
app.get('/online', (req, res) => {
    const now = Date.now();
    usersOnline = usersOnline.filter(u => now - u.time < 60000);
    res.json({ online: usersOnline.length });
});
app.get('/total', (req, res) => {
    res.json({ total: totalVisits }); // uniforma con il client
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
