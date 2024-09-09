exports.get = async function () {
    const salaModel = require('../models/salaModel');
    return await salaModel.listarSalas();
}

exports.entrar=async (iduser,idsala)=>{
    const sala = await salaModel.buscarSala(idsala);
    let usuarioModel=require('../models/usuarioModel');
    let user= await usuarioModel.buscarUsuario(iduser);
    user.sala={_id:sala._id, nome:sala.nome, tipo:sala.tipo};
    if(await usuarioModel.alterarUsuario(user)){
        return {msg:"OK", timestamp:timestamp=Date.now()};
    }
    return false;
}

exports.sair = async (iduser, idsala) => {
    let usuarioModel = require('../models/usuarioModel');
    let user = await usuarioModel.buscarUsuario(iduser);

    if (user && user.sala._id === idsala) {
        user.sala = null; // Remover a sala associada ao usuário.
        if (await usuarioModel.alterarUsuario(user)) {
            return true;
        }
    }
    return false;
}

/*const salaModel = require('../models/salaModel'); */
const salaModel = require('../models/salaModel');

exports.enviarMensagem = async (nick, msg, idSala) => {
    console.log("idSala:", idSala);
    try {
        console.log("Buscando sala com id:", idSala); // Verifica o idSala que está sendo buscado
        const sala = await salaModel.buscarSala(idSala);
        
        if (!sala) {
            console.error("Sala não encontrada com o id:", idSala);
            return { msg: "Sala não encontrada", error: true };
        }

        if (!Array.isArray(sala.msgs)) {
            sala.msgs = [];
        }

        const timestamp = Date.now();
        sala.msgs.push({
            nick: nick,
            msg: msg,
            timestamp: timestamp
        });

        let resp = await salaModel.atualizarMensagens(sala);
        return { msg: "OK", timestamp: timestamp };
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return { msg: "Erro ao enviar mensagem", error: true };
    }
};




exports.buscarMensagens = async (idsala, timestamp)=>{
    let mensagens=await salaModel.buscarMensagens(idsala, timestamp);
    return{
        "timestamp":mensagens[mensagens.length - 1].timestamp,
        "msgs":mensagens
    };
}