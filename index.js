const express = require('express');
const bodyParser = require('body-parser');
// const fs = require('fs/promises');
const talker = require('./talker.json');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (req, res) => 
  // if (!talker) res.status(200).send([]);
   res.status(200).json(talker));

// app.get('/talker', async (req, res) => {
//   const talkers = await fs.readFile('./talker.json');
//   return res.status(200).json(talkers);
// });

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const findId = talker.find((tal) => tal.id === +id);
  if (findId < 0 || !findId) {
 return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' }); 
}
  return res.status(200).json(findId);
});

app.listen(PORT, () => {
  console.log('Online');
});
