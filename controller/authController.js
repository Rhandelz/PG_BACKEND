const asyncHandler = require("express-async-handler");
const User = require("../model/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//POST
// login as a user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ message: "All field are mandatory" });
  }

  const foundUser = await User.findOne({ email }).maxTimeMS(30000);

  if (!foundUser) {
    res.status(401).json({ message: "User Not Found" });
  }

  const match = bcrypt.compare(password, foundUser.password);

  if (!match) {
    res.status(401).json({ message: "Password  Not Found" });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { email: foundUser.email, id: foundUser._id },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1d" }
  );

  // Create secure cookie with refresh token
  const cookie = res.cookie("jwt", refreshToken, {
    maxAge: 604800000, //cookie expiry: set to match rT
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
  });

  console.log(req.cookies);

  res.json({ accessToken });
});

//GET
//Get anothrt access token when it expires
const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const refreshToken = cookies.jwt;

  console.log(typeof refreshToken);
  console.log(process.env.REFRESH_TOKEN);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    asyncHandler(async (error, decoded) => {
      if (error) {
        console.error(error.message);

        return res.status(403).json({
          message: error.message,
        });
      }

      const foundUser = await User.findById({ _id: decoded.id }).exec();

      if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
};

// POST
// Create new User
//! Look To Bio's Error
const register = asyncHandler(async (req, res) => {
  const { name, email, password, bio, profile } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All Fields are Mandatory!" });
  }

  const duplicate = await User.findOne({ name: name }).maxTimeMS(30000);

  const userBio = bio || "";
  const userProfile = profile || "";

  if (duplicate) {
    return res.status(401).json({ message: "Email already Taken" });
  }

  const hashedPass = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPass,
    bio: userBio,
    profile: userProfile,
  });

  if (user) {
    res.status(201).json({
      message: `User ${name} Created`,
    });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// PUT
// Create new UserBio
const addUserBio = asyncHandler(async (req, res) => {
  const { id, bio } = req.body;

  const userBio = bio || "";

  if (!id) {
    return res.status(401).json({ message: "Id are Required" });
  }

  const user = await User.findById({ _id: id }).exec();

  if (!user) {
    return res.status(401).json({ message: "User Not Found" });
  }

  user.bio = userBio;

  const updatedBio = await user.save();

  if (updatedBio) {
    res.json({ message: `${user.name} 's bio is Updated` });
  }
});

//GET
//get Specific User
const getUser = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users) return res.status(401).json({ message: "No Users Found ! " });

  res.json(users);
});

//PUT
// edit your userInfo
const editUser = asyncHandler(async (req, res) => {
  const { id, name, bio, profile } = req.body;

  if (!name || !id) {
    return res.status(400).json({ message: "Update Value Required" });
  }

  const foundUser = await User.findById({ _id: id }).exec();

  if (!foundUser) {
    res.status(400).json({ message: "User Not Found !" });
  }

  const duplicate = await User.findOne({ name }).maxTimeMS(30000).exec();

  if (foundUser?._id.toHexString() !== id) {
    return res.status(401).json({ message: "Name Already Taken" });
  }

  foundUser.name = name;
  foundUser.bio = bio;
  foundUser.profile = profile;

  const updated = await foundUser.save();

  if (updated) {
    res.json({ message: `${foundUser.name} is Updated` });
  }
});

// POST
// LogOut User
const logout = (req, res) => {
  const cookie = req.cookies;

  if (!cookie) {
    return res.status(204);
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  res.json({ message: "User Logout & Cookie Cleared" });
};

module.exports = {
  login,
  register,
  logout,
  addUserBio,
  editUser,
  refresh,
  getUser,
};
