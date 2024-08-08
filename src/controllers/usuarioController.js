const token = ("../util/token");
const usuarioModel = require('../models/usuarioModel');

exports.entrar=async(nick)=>{
    let resp = await usuarioModel.registraUsuario(nick);
    if(resp.insertId){
        return { "idUser":resp.insertId,
            "token": await token.setToken(JSON.stringify(resp.insertId).replace(/"/g, ''),nick),
            "nick":nick}
        }
    }
}