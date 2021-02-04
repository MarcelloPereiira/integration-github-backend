const express = require("express");
const bodyParser = require("body-parser");
const FormData = require("form-data");
const fetch = require("node-fetch");
const cors = require("cors");
const { client_id, redirect_uri, client_secret } = require("./config");
const swaggerFile = require('./swagger_output.json')
const swaggerUi = require('swagger-ui-express')

const app = express();

app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use(bodyParser.json());
app.use(bodyParser.json({ type: "text/*" }));
app.use(bodyParser.urlencoded({ extended: false }));

// Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/authenticate", (req, res) => {
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
});

app.get("/users", (req, res) => {
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
});

app.get(`/user/:id/repos`, (req, res) => {
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
  
  return fetch(`https://api.github.com/user/${id}/repos?page=${page}&per_page=${per_page}`, {
    method: "GET",
  })
  .then((response) => response.json())
  .then((response) => {
    return res.status(200).json(response);
  })
  .catch((error) => {
    return res.status(400).json(error);
  });;
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
