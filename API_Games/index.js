const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken'); //Token
const cors = require('cors');// Configurar o CORS

//Chave secreta para o Token
const JWTSecret = 'jfsdjkgiorjfisdnkgmsdf534ew';

//CORS
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
    ],
    users: [
        {
            id: 1,
            nome: 'Heber',
            email: 'heber@teste.com',
            password: 123
        },
        {
            id: 14,
            nome: 'Gustavo',
            email: 'gustavo@teste.com',
            password: 123
        }
    ]
}

//Criação do Middware de autorização via TOKEN
function auth(req, res, next){
    const authToken = req.headers['authorization']; //Pega do cabeçalho

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        var token = bearer[1];

        jwt.verify(token, JWTSecret, (err, data) => {
            if(err){
                res.status(401);
                res.json({err: 'Token inválido!'});
            }else{
                //Armazena os dados do usuario logado
                req.token = token;
                req.usuarioLogado =  {id: data.id, email: data.email};
                next();
            }
        });
    }
    else{
        res.status(401);
        res.json({err: 'Token inválido!'});
    }
}

//Rotas
app.post('/auth', (req, res) => {
    //Pegar dados do Front-end
    var {email, password} = req.body;

    if(email != undefined){

        var user = DB.users.find(u => u.email == email);
        if(user != undefined){

            if(user.password == password){

                jwt.sign({id: user.id, email: user.email}, JWTSecret, {expiresIn: '48h'}, (error, token) =>{
                    if(error){
                        res.status(400);
                        res.json({err: 'Falha interna'});
                    }
                    else{
                        res.status(200);
                        res.json({token: token});
                    }
                });

            }
            else{
                res.status(401);
                res.json({err: 'Credenciais inválidas'});
            }
        }
        else{
            res.status(404);
            res.json({err: 'E-mail não cadastrado na base de dados'});
        }
    }
    else {
        res.status(400);
        res.json({err: 'O E-mail enviado não é válido'});
    }
});


app.get('/games', auth, (req, res) => {

    var dadosUsuario = req.usuarioLogado; //Pega esses dados a partir da autorizado pelo TOKEN

    res.statusCode = 200;
    res.json({user: dadosUsuario, dados: DB.games});
});

app.get('/game/:id', auth, (req, res) => {
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

app.post('/game', auth, (req, res) => {
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

app.put('/game/:id', auth, (req, res) => {
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

app.delete('/game/:id', auth, (req, res) => {
    
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