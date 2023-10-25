require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const {PORT} = process.env;

const app = express();
app.use(bodyParser.json());

const obsLembretes = {};

app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(obsLembretes[req.params.id] || [])
});

app.post('/lembretes/:id/observacoes', async (req, res) => {
    const index_obs = uuidv4();
    const { texto } = req.body;
    const obsLembreteEspecifico = obsLembretes[req.params.id] || [];
    obsLembreteEspecifico.push({ idObs: index_obs, texto, idLemb: req.params.id });
    obsLembretes[req.params.id] = obsLembreteEspecifico;
    await axios.post("http://localhost:10000/eventos", {
        tipo: 'ObservacaoCriada',
        dados:{
            idObs: index_obs,
            texto,
            idLemb: req.params.id,
        },
    });
    res.status(201).send(obsLembretes);
});

app.post('/eventos', (req, res) => {
    console.log(req.body);
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT, () => {
    console.log(`Observações. Porta ${PORT}`);
});