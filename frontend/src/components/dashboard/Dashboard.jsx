import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/repo/user/${userId}`
        );
        setRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/repo/all`);
        setSuggestedRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const filteredRepositories = suggestedRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepositories);
    }
  }, [searchQuery, suggestedRepositories]);
  return <h1>Dashboard</h1>;
};

export default Dashboard;
