const corsOptions = {
  origin: (origin, callback) => {
    if (
      ["https://photo-gallery-5r0s.onrender.com"].indexOf(origin) !== -1 ||
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
