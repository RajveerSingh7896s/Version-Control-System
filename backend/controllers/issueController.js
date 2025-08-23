const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
const User = require("../models/userModel");

const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    res.status(201).json({ message: "Issues Created!!", issue });
  } catch (err) {
    console.error("Error during creating Issue : ", err);
    res.status(500).send("Server Error!");
  }
};

const updateIssueById = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue Not Found!" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    const updatedIssue = await issue.save();

    res.json({ message: "Issue Updated successfully", issue: updatedIssue });
  } catch (err) {
    console.error("Error during Issue updation : ", err);
    res.status(500).send("Server Error!");
  }
};

const deleteIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue Not Found!!" });
    }

    res.json({ message: "Issue Deleted Successfully!!", issue });
  } catch (err) {
    console.error("Error during Issue deletion : ", err);
    res.status(500).send("Server Error!");
  }
};

const getAllIssues = async (req, res) => {
  const { id } = req.params;
  try {
    const issues = await Issue.find({ repository: id });

    if (issues.length == 0) {
      return res.status(404).json({ message: "Issues not found" });
    }

    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during Issue updation : ", err);
    res.status(500).send("Server Error!");
  }
};

const getIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue Not Found" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during fetching Issue by id : ", err);
    res.status(500).send("Server Error!");
  }
};

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
