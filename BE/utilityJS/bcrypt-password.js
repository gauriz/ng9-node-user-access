var bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);


module.exports.cryptPassword = async function (password) {
    var hash = bcrypt.hashSync(password, salt);
    return hash;
}

module.exports.comparePassword = function (password, hash) {
    try {
        var synched = bcrypt.compareSync(password, hash);
        return synched;
    } catch (err) {
        let error = new Error();
        error.name = 'BCRYPT_ERR';
        error.msg = 'Cannot decrypt given password';
        return error;
    }

}



