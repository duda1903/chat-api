const jwt = require('jsonwebtoken');

const checktoken = async (token, id, key) => jwt.verify(token, key, (err, decoded) =>{
    var jwt = require ('jsonwebtoken');
    var token = jwt.sign({foo: 'bar'}, 'shhhhh');
})

const setToken = async (id, key) =>{
    console.log(id);
    if(id){
        return jwt.sign({id}, key, {expiresIn: 28800});
    }
    return false;
};

module.exports = {checktoken, setToken,};