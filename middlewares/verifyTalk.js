// https://thewebdev.info/2021/05/11/how-to-validate-if-a-date-with-format-mm-dd-yyyy-in-javascript/
const verifyTalk = (req, res, next) => {
  const { talk } = req.body;
  // if (!talk) return res.status(400).end();
  if (!talk || !talk.watchedAt || talk.rate === undefined) {
    return res.status(400).json({
      message:
        'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }
  next();
};

module.exports = verifyTalk;
