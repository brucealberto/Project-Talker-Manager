const verifyDate = (req, res, next) => {
  const { talk } = req.body;
  const dateRegex = /^(0[1–9]|1\d|2\d|3[01])\/(0[1–9]|1[0–2])\/(19|20)\d{2}$/;
  const dateTest = dateRegex.test(talk.watchedAt);
  if (!dateTest) {
    return res.status(400).json({
      message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
    });
  }
  next();
};

module.exports = verifyDate;
