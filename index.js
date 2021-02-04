const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerFile = require('./swagger_output.json')
const swaggerUi = require('swagger-ui-express')
const auth = require('./routes/auth');
const users = require('./routes/users');

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

app.use('/authenticate', auth);
app.use('/users', users);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
