module.exports = (req, res) => {
  res.notFound = (data) => {
    res.status(404).send(data);
  };
};
