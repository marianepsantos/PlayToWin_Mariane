const db = require("../db/db");
const{ DataTypes } = require("sequelize");

const Usuario = db.define("Usuario", {
    nome: {
        type:DataTypes.STRING,
        required: true,
    },
    nickname: {
        type:DataTypes.STRING,
        required: true,
    },
});

module.exports = Usuario;