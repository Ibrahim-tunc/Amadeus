import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
const data = JSON.parse(fs.readFileSync('Airports.json', 'utf-8'));

app.get('/airports', (req, res) => {
 res.json(data.Airports);
});

app.get('/airports:filter', (req, res) => {
 const filt = req.params.filter;
 let airports = data.Airports.filter(filterFunc(filt));
 res.json(airports);
});

function filterFunc(filt) {
 return airport => airport.city?.slice(0,filt.length)?.toLowerCase() == filt.toLowerCase()
                   || airport.city?.toLowerCase().includes(filt.toLowerCase())
                   || airport.name?.slice(0,filt.length)?.toLowerCase() == filt.toLowerCase()
                   || airport.name?.toLowerCase().includes(filt.toLowerCase())
                   || airport.code?.slice(0,filt.length)?.toLowerCase() == filt.toLowerCase()
                   || airport.code?.toLowerCase().includes(filt.toLowerCase());
}

app.get('/api/:departure/:arrival/:date/', (req, res) => {
 const departure = req.params.departure;
 const arrival = req.params.arrival;
 const date = req.params.date;

 res.json(response);
});


const port = 3000;

app.listen(port, () => {
 console.log("Api Running");
});