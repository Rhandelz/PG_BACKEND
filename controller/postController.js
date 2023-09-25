const Post = require("../model/PostSchema");
const asyncHandler = require("express-async-handler");

//GET
//getting all posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().lean();

  if (!posts) {
    return res.status(400).json({ message: "No Post Found" });
  }

  res.json(posts);
});

//GET
//get specific post for a user
const getPost = asyncHandler(async (req, res) => {
  const userId = req.id;

  if (!userId) {
    return res.status(401).json({ message: "Unathoretized" });
  }

  const singlePost = await Post.find({
    user: userId,
  }).exec();

  if (!singlePost) {
    return res.json({ message: "No Post Found" });
  }

  res.json({
    ...singlePost,
  });
});

//POST
//adding a new post
const addPost = asyncHandler(async (req, res) => {
  const { user, caption, photoUrl, name } = req.body;

  await Post.create({ ...req.body });

  res.json({
    ...req.body,
  });
});

//PUT
//edit post
const editPost = asyncHandler(async (req, res) => {
  const { id, caption } = req.body;

  if ((!id, !caption)) {
    return res.status(401).json({ message: "All Field Are Required" });
  }

  const postResult = await Post.findById({ _id: id }).exec();

  if (!postResult) {
    return res.status(401).json({ message: "No Post Found" });
  }

  postResult.caption = caption;

  const updated = await postResult.save();

  if (updated) {
    res.json({ message: "Your Post is Updated" });
  }
});

//DELETE
//delete specific post
const deletePosts = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Post ID required" });
  }
  const post = await Post.findById(id).exec();

  if (!post) {
    return res.status(400).json({ message: "No Post Found" });
  }

  const result = await post.deleteOne();
  res.json({ message: "Post Deleted" });
});

module.exports = { getPosts, getPost, addPost, editPost, deletePosts };
