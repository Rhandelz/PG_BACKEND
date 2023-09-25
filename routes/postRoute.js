const express = require("express");
const router = express.Router();
const post = require("../controller/postController");
const verifyJWT = require("../middleware/verifyJwt");

router.use(verifyJWT);

router.get("/", post.getPosts);
router.get("/getpost", post.getPost);
router.post("/addpost", post.addPost);
router.put("/editpost", post.editPost);
router.delete("/deletepost", post.deletePosts);

module.exports = router;
