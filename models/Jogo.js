const conn = require("../db/db");
const {DataTypes} = require('sequelize');

const Jogo = db.define('Jogo', {
    Titulo: {
        type: DataTypes.STRING,
        required:false
    },
    Descricao: {
        type: DataTypes.STRING,
        required:false
    },
    PrecoBase: {
        type: DataTypes.DOUBLE,
        required:false
    },
});

module.exports = Jogo;