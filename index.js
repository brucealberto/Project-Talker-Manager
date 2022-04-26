const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const crypto = require('crypto');
const verifyEmail = require('./middlewares/verifyEmail');
const verifyPassword = require('./middlewares/verifyPassword');
const authorizationMddl = require('./middlewares/authorizationMiddl');
const verifyName = require('./middlewares/verifyName');
const verifyAge = require('./middlewares/verifyAge');
const verifyTalk = require('./middlewares/verifyTalk');
const verifyRate = require('./middlewares/verifyRate');
const verifyDate = require('./middlewares/verifyDate');
// const talker = require('./talker.json');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

// app.get('/talker', (req, res) =>
//   //  if (!talker) res.status(200).send([]);
//    res.status(200).json(talker));

app.get('/talker', async (req, res) => {
  try {
    const talkers = await fs.readFile('./talker.json');
    return res.status(200).json(JSON.parse(talkers));
  } catch (error) {
    return res.status(500).end();
  }
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile('./talker.json');
  const findId = JSON.parse(talkers).find((tal) => tal.id === +id);
  if (findId < 0 || !findId) {
    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findId);
});

app.post('/login', verifyEmail, verifyPassword, (req, res) => {
  // const { token } = req.headers;

  const generateToken = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token: generateToken });
});

app.post(
  '/talker',
  authorizationMddl,
  verifyName,
  verifyAge,
  verifyTalk,
  verifyRate,
  verifyDate,
  async (req, res) => {
    const { name, age, talk: { watchedAt, rate } } = req.body;
     const talkers = await fs.readFile('./talker.json', 'utf-8');
     const talkParse = JSON.parse(talkers);
     const talkObj = { id: talkParse.length + 1, name, age, talk: { watchedAt, rate } };
     const allTalkers = [...talkParse, talkObj];
     fs.writeFile('./talker.json', JSON.stringify(allTalkers));
    return res.status(201).json(talkObj);
  },
);

app.listen(PORT, () => {
  console.log('Online');
});

/**
 *   const { email, password } = req.body;
  switch (email && password) {
    case !email:
      return res.status(400).json({ message: 'O campo "email" é obrigatório' });
    case !email.includes('@', '.com'):
      return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
    case !password: 
      return res.status(400).json({ message: 'O campo "password" é obrigatório' });
    case password.length < 6:
      return 
    default:
      breae23e23k;
 */
