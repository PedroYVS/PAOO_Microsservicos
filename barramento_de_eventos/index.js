require('dotenv').config({ path: "C:/Users/aluno/Desktop/paoo/.env" });
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const { PORT_BARRAMENTO_DE_EVENTOS, PORT_LEMBRETES, PORT_OBSERVACOES, PORT_CONSULTA, PORT_CLASSIFICACAO } = process.env;

const app = express();
app.use(bodyParser.json());

const eventos = [];

app.post('/eventos', async (req, res) => {
    const evento = req.body;
    eventos.push(evento);
    try{ await axios.post(`http://localhost:${PORT_CONSULTA}/eventos`, evento); }
    catch(err){}
    try{ await axios.post(`http://localhost:${PORT_CLASSIFICACAO}/eventos`, evento); }
    catch(err){}
    try{ await axios.post(`http://localhost:${PORT_OBSERVACOES}/eventos`, evento); }
    catch(err){}
    try{ await axios.post(`http://localhost:${PORT_LEMBRETES}/eventos`, evento); }
    catch(err){}
    res.status(200).send({ msg: "ok" });
});

app.get('/eventos', (req, res) => { res.status(200).send(eventos) });

app.listen(PORT_BARRAMENTO_DE_EVENTOS, () => console.log(`Barramento de eventos. Porta ${PORT_BARRAMENTO_DE_EVENTOS}.`));