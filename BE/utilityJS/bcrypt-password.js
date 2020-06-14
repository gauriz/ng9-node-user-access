var bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);


module.exports.cryptPassword = async function (password) {
    var hash = bcrypt.hashSync(password, salt);
    console.log(hash);
}

module.exports.comparePassword = function (password, hash) {
    var synched = bcrypt.compareSync(password, hash);
    return synched;
}



