const createRepository = (req,res) => {
    res.send("REPOSITORY CREATED!!") ;
}

const getAllRepository = (req,res) => {
    res.send("ALL REPOSITORIES FETCHED!!") ;
}

const fetchRepositoryById = (req,res) => {
    res.send("REPOSITORY FETCHED BY ID") ;
}

const fetchRepositoryByName = (req,res) => {
    res.send("FETCHING REPOSITORIES BY NAME!!") ;
}

const fetchRepositoryByCurrentUser = (req,res) => {
    res.send("FETCHING REPOSITORIES OF CURRENT USER") ;
}

const updateRepositoryById = (req,res) => {
    res.send("UPDATING REPOSITORY...") ;
}

const toggleVisibilityById = (req,res) => {
    res.send("Toggling Visibility of Repository!!") ;
}

const deleteRepositoryById = (req,res) => {
    res.send("DELETING REPOSITORY!!") ;
}

module.exports = {
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryByCurrentUser,
    toggleVisibilityById,
    deleteRepositoryById,
    updateRepositoryById
}