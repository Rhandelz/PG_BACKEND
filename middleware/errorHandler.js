const errorHandler = (err, req, res, next) => {
  const status = res.statusCOde ? res.statusCOde : 500;

  res.status(status);

  res.json({ message: err.message });
};

module.exports = errorHandler;
