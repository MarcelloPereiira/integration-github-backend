const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");

const getUsers = async (req, res) => {
    const { since, per_page} = req.query;
    /* #swagger.parameters['since'] = {
            description: 'A user ID. Only return users with an ID greater than this ID..',
            type: 'string'
    } */
    /* #swagger.parameters['per_page'] = {
            description: 'Results per page (max 100).',
            type: 'string'
    } */
    return fetch(`https://api.github.com/users?since=${since}&per_page=${per_page}`, {
      method: "GET",
    })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });;
  };
  
  const getUserRepo = async (req, res) => {
    const { page, per_page} = req.query;
    const { id } = req.params;
  
    /* #swagger.parameters['page'] = {
            description: 'Page number of the results to fetch.',
            type: 'string'
    } */
    /* #swagger.parameters['per_page'] = {
            description: 'Results per page (max 100).',
            type: 'string'
    } */
    
    return fetch(`https://api.github.com/users/${id}/repos?page=${page}&per_page=${per_page}`, {
      method: "GET",
    })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      return res.status(400).json(error);
    });;
  };

  router.get('/', getUsers);
  router.get('/:id/repos', getUserRepo);

  module.exports = router;