const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;
let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("version-control-system");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User Already Exists!!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    
    res.json({token});
  } catch (err) {
    console.error("Error in signing up : ", err);
    res.status(500).send("Server Error!!");
  }
};

const login = (req, res) => {
  res.send("USER LOGGING IN...");
};

const getAllUser = (req, res) => {
  res.send("ALL USERS FETCHED...");
};

const getUserProfile = (req, res) => {
  res.send("GETTING USER PROFILE...");
};

const updateUserProfile = (req, res) => {
  res.send("UPDATING USER PROFILE....");
};

const deleteUserProfile = (req, res) => {
  res.send("DELETING USER PROFILE...");
};

module.exports = {
  getAllUser,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
