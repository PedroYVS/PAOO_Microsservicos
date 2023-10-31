require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const { PORT } = process.env;

const funcoes = {
    ObservacaoCriada: (obs) => {
        obs.status = obs.texto.toUpperCase().includes('IMPORTANTE') ? "Importante" : "Comum";
        axios.post("http://localhost:10000/eventos", {
            tipo: "ObservacaoClassificada",
            dados: obs,
        });
    },
}

app.post('/evento', (req, res) => {
    try{
        funcoes[req.body.tipo](req.body.dados);
    }
    catch(err){}
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT, async () => {
    console.log(`Classificação. Porta ${PORT}`)
    const verificando_eventos = await axios.get("http://localhost:10000/eventos");
    verificando_eventos.data.forEach((evento) => {
        try{
            funcoes[evento.tipo](evento.dados);
        }
        catch(err){}
    });
});