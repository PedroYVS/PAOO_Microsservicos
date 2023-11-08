require('dotenv').config({ path: "C:/Users/aluno/Desktop/paoo/.env" });
const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

const { PORT_CLASSIFICACAO, PORT_BARRAMENTO_DE_EVENTOS } = process.env;

const funcoes = {
    ObservacaoCriada: (obs) => {
        obs.status = obs.texto.toUpperCase().includes('IMPORTANTE') ? "Importante" : "Comum";
        axios.post(`http://localhost:${PORT_BARRAMENTO_DE_EVENTOS}/eventos`, {
            tipo: "ObservacaoClassificada",
            dados: obs,
        });
    },
}

app.post('/eventos', (req, res) => {
    try{ funcoes[req.body.tipo](req.body.dados); }
    catch(err){}
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT_CLASSIFICACAO, async () => {
    console.log(`Classificação. Porta ${PORT_CLASSIFICACAO}`)
    const verificando_eventos = await axios.get(`http://localhost:${PORT_BARRAMENTO_DE_EVENTOS}/eventos`);
    verificando_eventos.data.forEach((evento) => {
        try{ funcoes[evento.tipo](evento.dados); }
        catch(err){}
    });
});
