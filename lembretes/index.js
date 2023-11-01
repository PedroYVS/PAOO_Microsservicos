require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

const lembretes = {};

app.use(bodyParser.json());

const { PORT } = process.env;

app.get('/lembretes', (req, res) => { res.send(lembretes) });

app.get('/lembretes/:id', (req, res) => { res.send(lembretes[req.params.id] || []) });

app.post('/lembretes', async (req, res) => {
    const index_lemb = uuidv4();
    const { texto } = req.body;
    lembretes[index_lemb] = {
        index_lemb, texto
    }
    await axios.post("http://localhost:10000/eventos", {
        tipo: 'LembreteCriado',
        dados:{
            index_lemb,
            texto,
        },
    });
    res.status(201).send(lembretes[index_lemb]);
});

app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT, () => console.log(`Lembretes. Porta ${PORT}`));

