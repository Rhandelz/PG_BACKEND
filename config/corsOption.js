const corsOptions = {
  /*  origin: (origin, callback) => {
    if (
      ["https://elaborate-lokum-3bb075.netlify.app/"].indexOf(origin) !== -1 ||
      !origin
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }, */
  origin: "https://elaborate-lokum-3bb075.netlify.app",
  credentials: true,
  optionsSuccessStatus: 200,
  method: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

module.exports = corsOptions;
