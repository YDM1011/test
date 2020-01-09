module.exports = (req, res) => {
  res.ok = (data) => {
    res.status(200).send(data);
  };
};
