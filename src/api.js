const express = require("express");
const app = express();
const token = require('./util/token');
const salaController = require('./controllers/salaController');
const usuarioController = require('./controllers/usuarioController');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

app.use('/', router.get('/', async (req, res) => {
    res.status(200).send("<h1>API-CHAT</h1>");
}));

app.use('/sobre', router.get('/sobre', async (req, res) => {
    res.status(200).send({
        "nome": "API-CHAT",
        "version": "1.0.0",
        "autor": "Eduarda"
    });
}));

router.get("/salas", async (req, res) => {
    if (await token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) {
        let resp = await salaController.get();
        res.status(200).send(resp);
    } else {
        res.status(400).send({ msg: "Usuário não autorizado" });
    }
});

router.post("/entrar", async (req, res) => {
    let resp = await usuarioController.entrar(req.body.nick);
    res.status(200).send(resp);
});

router.put("/sala/entrar", async (req, res) => {
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
        return res.status(401).send({ msg: "Usuário não autorizado" });
    let resp = await salaController.entrar(req.headers.iduser, req.query.idsala);
    res.status(200).send(resp);
});

router.post("/sala/mensagem", async (req, res) => {
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
        return res.status(401).send({ msg: "Usuário não autorizado" });
    let resp = await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idSala);
    res.status(200).send(resp);
});

router.get("/sala/mensagens", async (req, res) => {
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
        return res.status(401).send({ msg: "Usuário não autorizado" });
    let resp = await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
    res.status(200).send(resp);
});

app.post("/sair", async (req, res) => {
    try {
        // No caso de um JWT, "sair" apenas significa que o cliente deve descartar o token.
        // Opcionalmente, se estivesse usando um sistema de tokens inválidos (blacklist), poderia adicioná-lo aqui.

        res.status(200).send({ message: "Logout realizado com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao tentar deslogar" });
    }
});

router.put("/sala/sair", async (req, res) => {
    if (!token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick))
        return res.status(401).send({ msg: "Usuário não autorizado" });

    let resp = await salaController.sair(req.headers.iduser, req.query.idsala);
    if (resp) {
        res.status(200).send({ msg: "Usuário saiu da sala" });
    } else {
        res.status(500).send({ msg: "Erro ao sair da sala" });
    }
});

module.exports = app;
