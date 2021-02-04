const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");
const FormData = require("form-data")
const { client_id, redirect_uri, client_secret } = require("./../config");

const authenticate = async (req, res) => {    
    const { code } = req.body;
    
    /* #swagger.parameters['code'] = {
            in: 'body',
            description: 'Code for authentication.',
            required: true,
            schema: {
              code: 'string'
            }
    } */
    const data = new FormData();
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", code);
    data.append("redirect_uri", redirect_uri);
  
    // Request to exchange code for an access token
    fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      body: data,
    })
      .then((response) => response.text())
      .then((paramsString) => {
        let params = new URLSearchParams(paramsString);
        const access_token = params.get("access_token");
  
        // Request to return data of a user that has been authenticated
        return fetch(`https://api.github.com/user`, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        });
      })
      .then((response) => response.json())
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        return res.status(400).json(error);
      });
  };

router.post('/', authenticate);

module.exports = router;
