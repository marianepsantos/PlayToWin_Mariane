require("dotenv").config();
const db = require("./db/db");

const Usuario = require("./models/Usuario");
const Cartao = require("./models/Cartao");
const Jogo = require("./models/Jogo");
const Conquista = require("./models/Conquista");

const express = require("express");

const exphbs = require("express-handlebars");

const { where } = require("sequelize");
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

app.get("/usuarios", async (req, res) => {
const usuarios = await Usuario.findAll ({ raw: true});
res.render("usuarios", { usuarios });
 
});


app.get("/jogos", async (req, res) =>{
    const jogos = await Jogo.findAll ({ raw: true});
    
    res.render("jogos", { jogos });
    
});



app.get("/usuarios/novo", (req, res) => {
   res.render("formUsuario");
});

app.post("/usuarios/novo", async (req,res)=>{
    const nickname = req.body.nickname;
    const nome = req.body.nome;

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
   res.render("formJogo");
});

app.post("/jogos/novo", async (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    const precoBase = req.body.precoBase;
        
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


app.get("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
  
    res.render("formJogo", { jogo });
});

app.post("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosJogo = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        precoBase: req.body.precoBase
    };

    const retorno = await Jogo.update(dadosJogo, { where: { id: id }, });

    if(retorno > 0){
        res.redirect("/jogos");
    } else {
        res.send("Erro ao atualizar jogo");
    }
});

app.post("/jogos/:id/delete", async (req, res) => {
    const id = parseInt(req.params.id);

    const retorno = await Jogo.destroy({ where: { id: id } });

    if (retorno > 0){
        res.redirect("/jogos");
    } else {
        res.send("Erro ao excluir jogo");
    }
});


app.post("/usuarios/:id/update", async (req,res) => {
    const id = parseInt (req.params.id);

    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    };

    const retorno = await Usuario.update(dadosUsuario, {where: { id: id}, });

    if (retorno > 0 ) {
        res.redirect("/usuarios");
       } else {
        res.redirect("Erro ao atualizar usuário");
       }
    });


app.post("/usuarios/:id/delete", async (req, res)=> {
    const id = parseInt(req.params.id);

   const retorno = await Usuario.destroy({ where: { id: id }, });

   if (retorno >0 ) {
    res.redirect("/usuarios");
   } else {
    res.send("Erro ao excluir usuário");
   }
});

app.get("/usuarios/:id/cartoes", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });
    
    const cartoes = await Cartao.findAll({
        raw: true,
        where: { UsuarioId: id},
    });

    res.render("cartoes.handlebars", { usuario, cartoes });
});

//Formulário de cadastro de cartões
app.get("/usuarios/:id/novoCartao", async (req, res) =>{
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    res.render("formCartao", { usuario });
});

//Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) =>{
    const id = parseInt(req.params.id);
    
    const dadosCartao = {
        numero: req.body.numero,
        nome: req.body.nome,
        codSeguranca: req.body.codSeguranca,
        UsuarioId: id,
    };

    await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});


app.get("/jogos/:id/conquista", async (req, res) =>{
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    const conquistas = await Conquistas.findAll({
        raw: true,
        where: { JogoId: id },
    });

    res.render("conquistas.handlebars", { jogo, conquistas });
});

// Formulário de cadastro de conquistas
app.get("/jogos/:id/novaconquista", async (req, res) =>{
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    res.render("formConquista", { jogo });
});

// Cadastro de conquista
app.post("/jogos/:id/novaconquista", async (req, res) =>{
    const id = parseInt(req.params.id);

    const dadosconquista = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        JogoId: id,
    };

    await Conquista.create(dadosConquista);

    res.redirect(`/jogos/${id}/conquistas`);
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