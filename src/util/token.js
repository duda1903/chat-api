const jwt = require('jsonwebtoken');

const checkToken = async (token, id, key) => {
    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, key);

        // Verifica se o ID no token corresponde ao ID fornecido
        if (decoded.id === id) {
            return { valid: true, decoded };
        } else {
            return { valid: false, message: 'ID nao sao compativeis' };
        }
    } catch (err) {
        // Se houver um erro na verificação do token
        return { valid: false, message: err.message };
    }
};
const setToken = async (id, key) =>{
    console.log(id);
    if(id){
        return jwt.sign({id}, key, {expiresIn: 28800});
    }
    return false;
};

module.exports = {checkToken, setToken,};