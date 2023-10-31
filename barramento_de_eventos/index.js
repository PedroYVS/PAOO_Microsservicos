require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const { PORT } = process.env;

const app = express();
app.use(bodyParser.json());

const eventos = [];

app.post('/eventos', (req, res) => {
    const evento = req.body;
    eventos.push(evento);
    axios.post("http://localhost:4000/eventos", evento);
    axios.post("http://localhost:5000/eventos", evento);
    axios.post("http://localhost:6000/eventos", evento);
    axios.post("http://localhost:7000/eventos", evento);
    res.status(200).send({ msg: "ok" });
});

app.get('/eventos', (req, res) => { res.status(200).send(eventos) });

app.listen(PORT, () => console.log(`Barramento de eventos. Porta ${PORT}.`));