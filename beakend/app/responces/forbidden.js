module.exports = (req, res) => {
  res.forbidden = (data) => {
    res.status(403).send(data);
  };
};
