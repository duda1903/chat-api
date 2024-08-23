
const usuarioModel = require('../models/usuarioModel');

exports.entrar = async (nick) => {
    let resp = await usuarioModel.registrarUsuario(nick);
    const token = require("../util/token");
    console.log(token)
    console.log(resp)
    if (resp.insertedId) {
        console.log(JSON.stringify(resp.insertedId))
        console.log(await token.setToken(JSON.stringify(resp.insertedId), nick));
        return {
            "idUser": resp.insertedId,
            "token": await token.setToken(JSON.stringify(resp.insertedId).replace(/"/g, ''), nick),
            "nick": nick
        }
    }
    else{
        return {
            "status": "deu ruim"
        }
    }
}

exports.sair = async (idUser) => {
    let user = await usuarioModel.buscarUsuario(idUser);
    if (user) {
        user.sala = null;  // Limpar a sala associada ao usuário.
        await usuarioModel.alterarUsuario(user);  // Atualizar o usuário no banco.
        return true;
    }
    return false;
}