
module.exports = (req, res) => {
  res.badRequest = (data) => {
      res.status(400).send(data);
  };
};
