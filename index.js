const express = require('express');
const server = express();
const apicache = require('apicache');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const openssl = require('openssl-nodejs')

let cache = apicache.middleware;

server.use(express.json());
server.use(cors());
server.use(cache('2 minutes'));
server.use(bodyParser.json());

const resultados = {
  pessoas: [
    { id: 1, nome: "Marcelo" },
    { id: 2, nome: "João" },
    { id: 3, nome: "Maria" }
  ],
  carros: [
    { id: 1, modelo: "Fusca" },
    { id: 2, modelo: "Gol" },
    { id: 3, modelo: "Palio" }
  ],
  animais: [
    { id: 1, nome: "Cachorro" },
    { id: 2, nome: "Gato" },
    { id: 3, nome: "Papagaio" }
  ]
};

server.get('/:tipo', (req, res) => {
  const tipo = req.params.tipo;
  const dados = resultados[tipo];
  if (dados) {
    res.json(dados);
  } else {
    res.status(404).json({ mensagem: 'Tipo não encontrado' });
  }
});

// Rota para retornar um item específico de um tipo
server.get('/:tipo/:id', (req, res) => {
  const tipo = req.params.tipo;
  const id = parseInt(req.params.id);
  const dados = resultados[tipo];
  if (dados) {
    const item = dados.find(item => item.id === id);
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ mensagem: 'Item não encontrado' });
    }
  } else {
    res.status(404).json({ mensagem: 'Tipo não encontrado' });
  }
});

server.get('/', (req, res) => {
    res.status(200).send('Olá, seja bem vindo ao meu servidor')
});

server.listen(3000, () => {
  console.log('Servidor está rodando em http://localhost:3000')})

https.createServer({
  cert: fs.readFileSync('src/SSL/code.crt'),
  key: fs.readFileSync('src/SSL/code.key')
}, server).listen(3001,() => console.log ("Rodando em https"));