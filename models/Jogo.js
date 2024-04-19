const db = require("../db/db");
const {DataTypes} = require('sequelize');

const Jogo = db.define('Jogo', {
    titulo: {
        type: DataTypes.STRING,
        required:false
    },
    descricao: {
        type: DataTypes.STRING,
        required:false
    },
    precoBase: {
        type: DataTypes.DOUBLE,
        required:false
    },
});

module.exports = Jogo;