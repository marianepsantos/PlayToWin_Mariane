require("dotenv").config();
const db = require("./db/db");

const Usuario = require("./models/Usuario");

const express = require("express")
const app = express();

app.use(
    express.urlencoded({
        extended:true,
    })
);

app.use(express.json());

app.get("/usuarios/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formUsuario.html`);
});

app.post("/usuarios/novo", async, (req,res)=>{
    const nickname = req.bory.nickname;
    const nome = req.bory.nome;

    const dadosUsuario = {
        nickname,
        nome,
    };

    const usuario = Usuario.create(dadosUsuario);

    res.send("Usuário inserido sob o id" + usuario.id);
});

app.listen(8000);

db
.sync()
.then(() => {
    console.log("A conexão com o banco de dados foi sincronizado com sucesso!");
})
.catch((err) => {
    console.log("Ocorreu um erro durante a tentativa de conexão com o banco de dados:" + err);
});