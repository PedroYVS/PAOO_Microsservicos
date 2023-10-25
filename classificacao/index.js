require('dotenv').config();
const express = require('express');

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
    funcoes[req.body.tipo](req.body.dados);
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT, () => console.log(`Classificação. Porta ${PORT}`));