require("dotenv").config();
const db = require("./db/db");

db
.authenticate()
.then(() => {
    console.log("A conexão com o banco de dados foi estabelecida com sucesso!");
})
.catch((err) => {
    console.log("Ocorreu um erro durante a tentativa de conexão com o banco de dados:" + err);
});