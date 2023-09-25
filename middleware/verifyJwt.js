const jwt = require("jsonwebtoken");

const verityJWT = (req, res, next) => {
  const authHead = req.headers.authorization || req.headers.Authorization;

  console.log(authHead);

  if (!authHead?.startsWith("Bearer")) {
    return res.status(403).json({ message: "Unauthoritized" });
  }
  const token = authHead.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden Error" });
      console.log(err);
    }

    req.id = decoded.UserInfo.id;
    req.user = decoded.UserInfo.name;
    req.email = decoded.UserInfo.email;
    next();
  });
};

module.exports = verityJWT;
