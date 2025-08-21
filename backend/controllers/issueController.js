const createIssue = (req,res) => {
    res.send("Issue created") ;
}

const updateIssueById = (req,res) => {
    res.send("Updating Issue!");
}

const deleteIssueById = (req,res) => {
    res.send("Issue deleted") ;
}

const getAllIssues = (req,res) => {
    res.send("All Issues fetched!!");
}

const getIssueById = (req,res) => {
    res.send("Fetched issue by Id...");
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}