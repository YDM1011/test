module.exports = (req, res) => {
  res.serverError = (data) => {
    res.status(500).send(data);
  };
};
