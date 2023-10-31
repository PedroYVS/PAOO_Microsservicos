require('dotenv').config();
const express = require('express');

const app = express();

const { PORT } = process.env;

const baseConsulta = {};

const funcoes = {
    LembreteCriado: (lemb) => {
        baseConsulta[lemb.index_lemb] = lemb;
    },
    ObservacaoCriada: (obs) => {
        const observacoes = baseConsulta[obs.idLemb]["observacoes"] || [];
        observacoes.push(obs);
        baseConsulta[obs.idLemb]["observacoes"] = observacoes;
    },
    ObservacaoAtualizada: (obs) => {
        const observacoes = baseConsulta[obs.idLemb]["observacoes"];
        const obs_index = observacoes.findIndex(ob => ob.idLemb === obs.idLemb);
        observacoes[obs_index] = obs;
    },
};

app.use(express.json());

app.get("/consulta_geral", (req, res) => {
    res.status(200).send(baseConsulta);
});

app.post("/eventos", (req, res) => {
    try{
        funcoes[req.body.tipo](req.body.dados);
    }
    catch(err){}
    res.status(200).send(baseConsulta);
});

app.listen(PORT, async () => {
    console.log(`Consultas. Porta ${PORT}`)
    const verificando_eventos = await axios.get("http://localhost:10000/eventos");
    verificando_eventos.data.forEach((evento) => {
        try{
            funcoes[evento.tipo](evento.dados);
        }
        catch(err){}
    });
});