require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const porta = process.env.PORT;

const app = express();
app.use(bodyParser.json());

app.post('/eventos', (req, res) => {
    const evento = req.body;
    axios.post('http://localhost:4000/eventos', evento);
    axios.post('http://localhost:5000/eventos', evento);
    res.status(200).send({ msg: "ok" });
});

app.listen(porta, () => {
    console.log('Barramento de eventos. Porta 1000.');
});