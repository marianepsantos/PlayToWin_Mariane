require("dotenv").config();
const db = require("./db/db");

const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");

const express = require("express")

const exphbs = require("express-handlebars");

// Instanciação do servidor//
const app = express();

//Vinculação do Handlebars ao Express://
app.engine ("handlebars", exphbs.engine());
app.set("view engine", "handlebars")

//Configurações mo express para facilitar a captura de dados recebidos de formulários//
app.use(
    express.urlencoded({
        extended:true,
    })
);

app.use(express.json());

app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/usuarios", async (req, res) =>{
const usuarios = await Usuario.findALL ({ raw: true});

res.render("usuarios");

});

app.get("/usuarios/novo", (req, res) => {
   res.render("formUsuario");
});

app.post("/usuarios/novo", async (req,res)=>{
    const nickname = req.bory.nickname;
    const nome = req.bory.nome;

    const dadosUsuario = {
        nickname,
        nome,
    };

    try {
        const usuario = await Usuario.create(dadosUsuario); 
        res.send("Usuário inserido sob o id " + usuario.id);
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).send("Erro ao cadastrar usuário");
    }
});


app.get("/jogos/novo", (req, res) => {
    res.sendFile(`${__dirname}/views/formJogo.html`);
});

app.post("/jogos/novo", async (req, res) => {
    const titulo = req.bory.titulo;
    const descricao = req.bory.descricao;
    const precoBase = req.bory.precoBase;
        
    const dadosJogo = {
        titulo,
        descricao, 
        precoBase,
    };

    try {
        const jogo = await Jogo.create(dadosJogo);
        res.send("Jogo inserido sob o id " + jogo.id);
    } catch (error) {
        console.error("Erro ao cadastrar jogo:", error);
        res.status(500).send("Erro ao cadastrar jogo");
    }
});

const PORT = process.env.PORT || 8000;

db  
    .sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Servidor rodando na porta " + PORT);
        });
    })
    .catch((err) => {
        console.error("Ocorreu um erro durante a tentativa de conexão com o banco de dados:", err);
    });