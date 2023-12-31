require('dotenv').config({ path: "C:/Users/aluno/Desktop/paoo/.env" });
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const { PORT_OBSERVACOES, PORT_BARRAMENTO_DE_EVENTOS } = process.env;

const app = express();
app.use(bodyParser.json());

const obsLembretes = {};

const funcoes = {
    ObservacaoClassificada: (obs) => {
        const obsParaAtualizar = obsLembretes[obs.idLemb].find(ob => ob.idLemb === obs.idLemb);
        obsParaAtualizar.status = obs.status;
        axios.post(`http://localhost:${PORT_BARRAMENTO_DE_EVENTOS}/eventos`, {
            tipo: "ObservacaoAtualizada",
            dados: obs,
        });
    },
};

app.get('/lembretes/:id/observacoes', (req, res) => res.send(obsLembretes[req.params.id] || []));

app.post('/lembretes/:id/observacoes', async (req, res) => {
    const index_obs = uuidv4();
    const { texto } = req.body;
    const obsLembreteEspecifico = obsLembretes[req.params.id] || [];
    const statusInicial = "Indefinido";
    obsLembreteEspecifico.push({ idObs: index_obs, texto, idLemb: req.params.id, status: statusInicial });
    obsLembretes[req.params.id] = obsLembreteEspecifico;
    await axios.post(`http://localhost:${PORT_BARRAMENTO_DE_EVENTOS}/eventos`, {
        tipo: 'ObservacaoCriada',
        dados:{
            idObs: index_obs,
            texto,
            idLemb: req.params.id,
            status: statusInicial,
        },
    });
    res.status(201).send(obsLembretes);
});

app.post('/eventos', (req, res) => {
    try{ funcoes[req.body.tipo](req.body.dados); }
    catch(err){}
    res.status(200).send({ msg: "ok" });
});

app.listen(PORT_OBSERVACOES, () => console.log(`Observações. Porta ${PORT_OBSERVACOES}`));