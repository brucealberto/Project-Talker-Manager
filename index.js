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

const PATHTALKER = './talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (req, res) => {
  try {
    const talkers = await fs.readFile(PATHTALKER);
    return res.status(200).json(JSON.parse(talkers));
  } catch (error) {
    return res.status(500).end();
  }
});

app.get('/talker/search', authorizationMddl, async (req, res) => {
  const { q } = req.query;
  const readTalkers = JSON.parse(await fs.readFile(PATHTALKER));
  if (!q) return res.status(200).json(readTalkers);
  const filterTalkers = readTalkers.filter((fil) => fil.name.includes(q));
  if (!filterTalkers) return res.status(200).json([]);
  return res.status(200).json(filterTalkers); 
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(PATHTALKER);
  const findId = JSON.parse(talkers).find((tal) => tal.id === +id);
  if (findId < 0 || !findId) {
    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findId);
});

app.post('/login', verifyEmail, verifyPassword, (req, res) => {
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
    const {
      name,
      age,
      talk: { watchedAt, rate },
    } = req.body;
    const talkers = await fs.readFile(PATHTALKER, 'utf-8');
    const talkParse = JSON.parse(talkers);
    const talkObj = {
      id: talkParse.length + 1,
      name,
      age,
      talk: { watchedAt, rate },
    };
    const allTalkers = [...talkParse, talkObj];
    fs.writeFile(PATHTALKER, JSON.stringify(allTalkers));
    return res.status(201).json(talkObj);
  },
);

app.put(
  '/talker/:id',
  authorizationMddl,
  verifyName,
  verifyAge,
  verifyTalk,
  verifyRate,
  verifyDate,
  async ({ body, params }, res) => {
    const { id } = params;
    const readTalkers = JSON.parse(await fs.readFile(PATHTALKER));
    const findIndex = readTalkers.findIndex((fin) => fin.id === +id);
    readTalkers[findIndex] = { id: +id, ...body };
    await fs.writeFile(PATHTALKER, JSON.stringify(readTalkers));
    return res.status(200).json(readTalkers[findIndex]);
  },
);

app.delete('/talker/:id', authorizationMddl, async ({ params }, res) => {
  const { id } = params;
  const readTalkers = JSON.parse(await fs.readFile(PATHTALKER));
  const findIndex = readTalkers.findIndex((fin) => fin.id === +id);
  readTalkers.splice(findIndex, 1);
  await fs.writeFile(PATHTALKER, JSON.stringify(readTalkers));
  return res.status(204).json(readTalkers[findIndex]);
});

app.listen(PORT, () => {
  console.log('Online');
});
