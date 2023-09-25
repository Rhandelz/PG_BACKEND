const corsOptions = {
  origin: (origin, callback) => {
    if (
      [
        "https://6511ab20b70803390434015f--nimble-tarsier-8326cb.netlify.app",
      ].indexOf(origin) !== -1 ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
