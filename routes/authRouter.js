const express = require("express");
const router = express.Router();
const controller = require("../controller/authController");
const jwtVerify = require("../middleware/verifyJwt");

router.post("/", controller.login);

router.get("/getuser", controller.getUser);

router.post("/logout", controller.logout);

router.post("/register", controller.register);

router.put("/addbio", controller.addUserBio);

router.put("/update", controller.editUser);

router.get("/refresh", controller.refresh);

module.exports = router;
