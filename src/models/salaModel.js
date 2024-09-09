const db = require('./db.js');
const { ObjectId } = require('mongodb');

async function listarSalas() {
    try {
        return await db.findAll('salas');
    } catch (err) {
        console.error('Erro ao listar salas:', err);
        throw err;
    }
}

let buscarSala = async (timestamp) => {
    try {
        // Cria o ObjectId a partir do timestamp
        const id = ObjectId.createFromTime(timestamp);
        return await db.findOne('salas', id);
    } catch (err) {
        console.error('Erro ao buscar sala:', err);
        throw err;
    }
}

let atualizarMensagens = async (sala) => {
    try {
        // Atualiza a sala com novas mensagens
        const resultado = await db.updateOne('salas', { msgs: sala.msgs }, { _id: sala._id });
        if (resultado.matchedCount === 0) {
            console.error("Sala não encontrada para atualizar mensagens");
            return { msg: "Sala não encontrada", error: true };
        } else if (resultado.modifiedCount === 0) {
            console.error("Nenhuma mensagem foi atualizada");
            return { msg: "Nenhuma mensagem foi atualizada", error: true };
        } else {
            return { msg: "Mensagens atualizadas com sucesso" };
        }
    } catch (err) {
        console.error('Erro ao atualizar mensagens:', err);
        throw err;
    }
}

let buscarMensagens = async (timestamp, timestampFiltro) => {
    try {
        let sala = await buscarSala(timestamp);
        if (sala && sala.msgs) {
            // Filtra mensagens com base no timestamp
            let msgs = sala.msgs.filter((msg) => msg.timestamp >= timestampFiltro);
            return msgs;
        }
        return [];
    } catch (err) {
        console.error('Erro ao buscar mensagens:', err);
        throw err;
    }
}

module.exports = { listarSalas, buscarSala, atualizarMensagens, buscarMensagens };
