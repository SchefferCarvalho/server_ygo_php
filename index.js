var express = require('express');
const { check, validationResult } = require('express-validator/check');

var app = express();
var bodyParser = require('body-parser');
var port = 3000; //porta padrão
var mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.text());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);

//inicia o servidor
app.listen(port);
console.log('API funcionando na porta ' + port);

function execSQLQuery(sqlQry, res) {
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3000,
    user: 'ygo',
    password: '12345',
    database: 'cup'
  });

  connection.query(sqlQry, function (error, results, fields) {
    if (error)
      res.json(error);
    else
      res.json(results);
    connection.end();
    // console.log('executou!');
  });
}

router.get('/tb_tipo_carta', (req, res) => {
  execSQLQuery('SELECT * FROM td_tipo_carta', res);
})

router.get('/tb_carta', (req, res) => {
  execSQLQuery('SELECT * FROM tb_carta', res);
})

router.get('/tb_deck', (req, res) => {
  execSQLQuery('SELECT * FROM tb_deck', res);
})

router.get('/ta_carta_has_ta_deck', (req, res) => {
  execSQLQuery('SELECT * FROM ta_carta_has_ta_deck', res);
})



// início da rotas de usuários

// CRUD COMPLETO

// modelo de api para listar todos os dados de uma tabela
router.get('/tb_usuario', (req, res) => {
  execSQLQuery('SELECT email_usua, pwd_usua FROM tb_usuario', res);
})

// modelo de api para listar todos os dados de uma tabela
// :id entrada do usuário que será alterado
// exemplo http://localhost:3000/tb_usuario/11
router.get('/tb_usuario/:id', (req, res) => {

  id = req.params.id;

  check(id).isNumeric();

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
    console.log('entrei aqui');
  } else {
    execSQLQuery(`SELECT * FROM tb_usuario WHERE idt_usuario = '${id}'`, res);
    res.status(200);
  }
})

// modelo de api para adicionar dados na tabela
// exemplo de body da requisição
// {
//   "email": "arthur@gmail.com.br",
//   "nome": "arthur",
//   "password": "123456",
//   "nick": "arthurzinhoSEMgameplay"
// }
router.post('/tb_usuario', (req, res) => {

  obj = JSON.parse(req.body);

  var email = obj.email;
  var nome = obj.nome;
  var password = obj.password;
  var nick = obj.nick;

  var erros = req.validationErrors();

  execSQLQuery(`INSERT INTO tb_usuario(email_usua,nme_usua,pwd_usua,nicknme_usua)VALUES('${email}','${nome}','${password}','${nick}')`, res);
  res.status(200);

});

// modelo de API para deletar dados na tabela
router.delete('/tb_usuario/:id', (req, res) => {

  id = req.params.id;

  execSQLQuery(`DELETE FROM tb_usuario WHERE idt_usuario = '${id}'`, res);
  res.status(200);
});


// modelo de API para alterar dados na tabela
// :id entrada do usuário que será alterado
// exemplo http://localhost:3000/tb_usuario/11
// exemplo de body da requisição
// {
//   "email": "arthur@gmail.com.br",
//   "nome": "arthur",
//   "password": "123456",
//   "nick": "arthurzinhoSEMgameplay"
// }
app.put('/tb_usuario/:id', function (req, res) {

  obj = JSON.parse(req.body);
  id = req.params.id;

  var email = obj.email;
  var nome = obj.nome;
  var password = obj.password;
  var nick = obj.nick;

  execSQLQuery(`UPDATE tb_usuario SET email_usua = '${email}', nme_usua = '${nome}', pwd_usua = '${password}', nicknme_usua = '${nick}' WHERE idt_usuario = ${id}`, res);
  res.status(200);
});


router.get('/confere-usuario/:usuario/:senha', (req, res) => {

  usuario = req.params.usuario;
  senha = req.params.senha;
  let resultado;
  execSQLQuery(`SELECT * FROM tb_usuario WHERE email_usua = '${usuario}' AND pwd_usua = '${senha}'`, res);

})

// fim da rotas de usuários