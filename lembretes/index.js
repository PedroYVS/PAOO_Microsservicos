require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

const lembretes = {};

app.use(bodyParser.json());

const { PORT } = process.env;

app.get('/lembretes', (req, res) => {
    res.send(lembretes);
});

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
    //A linha de código abaixo serve para retornar uma mensagem de confirmação. A parte "send" em especial retorna o objeto recém-criado.
    res.status(201).send(lembretes[index_lemb]);
});

app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT, () => console.log(`Lembretes. Porta ${PORT}`));

