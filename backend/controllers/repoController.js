const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const createRepository = async (req, res) => {
  const { name, description, content, visibility, owner, issues } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Repository name is required!" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid userID!" });
    }

    const newRepository = new Repository({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });

    const result = await newRepository.save();
    res
      .status(201)
      .json({ message: "Repository Created !!", repositoryID: result._id });
  } catch (err) {
    console.error("Error during repo creation : ", err);
    res.status(500).send("Server error!");
  }
};

const getAllRepository = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json({ repositories });
  } catch (err) {
    console.error("Error in fetcing Repository : ", err);
    res.status(500).send("Server error!");
  }
};

const fetchRepositoryById = async (req, res) => {
  const repoId = req.params.id;
  try {
    const repo = await Repository.find({ _id: repoId })
      .populate("owner")
      .populate("issues");

    res.json(repo);
  } catch (err) {
    console.error("Error in fetcing Repository by ID : ", err);
    res.status(500).send("Server error!");
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const repo = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repo);
  } catch (err) {
    console.error("Error in fetcing Repository by name : ", err);
    res.status(500).send("Server error!");
  }
};

const fetchRepositoryByCurrentUser = async (req, res) => {
  const {userId} = req.params;
  try {
    const repositories = await Repository.find({ owner: userId });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "Users Repositories Not Found!!" });
    }

    res.json({ message: "Repositories Found!", repositories });
  } catch (err) {
    console.error("Error in fetcing users Repositories ", err);
    res.status(500).send("Server error!");
  }
};

const updateRepositoryById = async (req, res) => {
  const { id } = req.params;
  const { content, description } = req.body;
  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ message: "Repository Not Found" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepo = await repository.save();

    res.json({
      message: "Repository Updated successfully!!",
      repository: updatedRepo,
    });
  } catch (err) {
    console.error("Error during updating Repository ", err);
    res.status(500).send("Server error!");
  }
};

const toggleVisibilityById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: "Repository Not Found!!" });
    }

    repository.visibility = !repository.visibility;
    const updatedRepo = await repository.save();

    res.json({
      message: "Repository Visibility toggled successfully!!",
      repository: updatedRepo,
    });
  } catch (err) {
    console.error("Error during toggling Repository ", err);
    res.status(500).send("Server error!");
  }
};

const deleteRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete({ _id: id });

    if (!repository) {
      return res.status(404).json({ message: "Repository Not Found!!" });
    }

    res.json({
      message: "Repository deleted successfully!!",
      repository,
    });
  } catch (err) {
    console.error("Error during deleting Repository ", err);
    res.status(500).send("Server error!");
  }
};

module.exports = {
  createRepository,
  getAllRepository,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryByCurrentUser,
  toggleVisibilityById,
  deleteRepositoryById,
  updateRepositoryById,
};
