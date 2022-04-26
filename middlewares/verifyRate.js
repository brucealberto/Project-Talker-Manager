const verifyRate = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate > 5 || +talk.rate <= 1) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
  }
  next();
};

module.exports = verifyRate;
