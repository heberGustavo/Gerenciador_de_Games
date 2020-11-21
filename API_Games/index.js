const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Configurar o CORS
const cors = require('cors');
app.use(cors());


//Para converter os dados para Json
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Dados
var DB = {
    games: [
        {
            id: 1,
            nome: 'FIFA 20',
            ano: 2020,
            preco: 100
        },
        {
            id: 52,
            nome: 'Black',
            ano: 2012,
            preco: 59
        },
        {
            id: 15,
            nome: 'Call of Duty',
            ano: 2015,
            preco: 89
        }
    ]
}


//Rotas
app.get('/games', (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get('/game/:id', (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400); //Erro de parametro invalido
    } 
    else {
        var id = parseInt(req.params.id);

        var game = DB.games.find(g => g.id == id);
        if(game != undefined){
            res.json(game);
            res.statusCode = 200;
        } 
        else {
            res.sendStatus(404);
        }
    }
});

app.post('/game', (req, res) => {
    var { nome, ano, preco} = req.body; //Pega dados da requisicao

    if(nome == undefined || isNaN(ano) || isNaN(preco)){
        res.sendStatus(400);

    } else{
        DB.games.push({
            id: 504,
            nome,
            ano,
            preco
        });

        res.sendStatus(200)
    }
});

app.put('/game/:id', (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400); //Erro de parametro invalido
    } 
    else {
        var id = parseInt(req.params.id);
        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            var { nome, ano, preco} = req.body; //Pega dados da requisicao

            if(nome != undefined){
                game.nome = nome;
            }

            if(ano != undefined){
                game.ano = ano;
            }

            if(preco != undefined){
                game.preco = preco;
            }

            res.sendStatus(200);
        } 
        else {
            res.sendStatus(404);
        }
    }
});

app.delete('/game/:id', (req, res) => {
    
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }
    else {
        var id = parseInt(req.params.id);
        var index = DB.games.findIndex(g => g.id == id);

        if(index == -1){ //Nao encontrou
            res.sendStatus(404);
        }
        else{
            DB.games.splice(index, 1);
            res.sendStatus(200);
        }
    }
});

//Servidor
app.listen(8080, () => {
    console.log("API rodando");;
})