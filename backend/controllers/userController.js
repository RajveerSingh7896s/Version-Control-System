const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");
const dotenv = require("dotenv");
const ObjectId = require("mongodb").ObjectId;

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

    res.json({ token });
  } catch (err) {
    console.error("Error in signing up : ", err);
    res.status(500).send("Server Error!!");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectClient();
    const db = client.db("version-control-system");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Creadential" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Creadential" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error("Error during logIn : ", err.message);
    res.status(500).send("Server Error!");
  }
};

const getAllUser = async (req, res) => {
  try {
    await connectClient();
    const db = client.db("version-control-system");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error("Error during logIn : ", err.message);
    res.status(500).send("Server Error!");
  }
};

const getUserProfile = async (req, res) => {
  const currentID = req.params.id;
  try {
    await connectClient();
    const db = client.db("version-control-system");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(currentID),
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server Error!");
  }
};

const updateUserProfile = async (req, res) => {
  const currentID = req.params.id;
  const { email, password } = req.body;

  await connectClient();
  const db = client.db("version-control-system");
  const usersCollection = db.collection("users");

  try {
    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" }
    );
    if (!result) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    res.json({message:"Profile updated successfully!"});
  } catch (err) {
    console.error("Error during updation : ", err.message);
    res.status(500).send("Server Error!");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentID = req.params.id;
  try {
    await connectClient();
    const db = client.db("version-control-system");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if(result.deleteCount == 0){
      return res.status(404).json({message:"User Not Found!"});
    }

    res.json({message:"Users profile deleted!"}) ;
  } catch (err) {
    console.error("Error during deleting : ", err.message);
    res.status(500).send("Server Error!");
  }
};

module.exports = {
  getAllUser,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
