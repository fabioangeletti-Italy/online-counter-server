const express = require('express');
const app = express();
app.use(express.json());
let usersOnline = [];
app.post('/online', (req,res)=>{
  const now = Date.now();
  const ip = req.ip;
  // Rimuove utenti inattivi da più di 60 secondi
  usersOnline = usersOnline.filter(u=>now-u.time<60000);
  // Aggiorna o aggiunge l'utente corrente
  const index = usersOnline.findIndex(u=>u.ip===ip);
  if(index>-1) usersOnline[index].time = now;
  else usersOnline.push({ip,time:now});
  res.sendStatus(200);
});
app.get('/online', (req, res) => {
  const now = Date.now();
  const ip = req.ip;
  usersOnline = usersOnline.filter(u => now - u.time < 60000);
  const index = usersOnline.findIndex(u => u.ip === ip);
  if (index > -1) usersOnline[index].time = now;
  else usersOnline.push({ ip, time: now });
  res.send("online");
});
