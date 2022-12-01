const axios = require("axios");
const express = require("express");

const PORT = process.env.PORT || 5000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/api/supervisors", (req, res) => {
  axios.get("https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers")
    .then((response) => {
      console.log(response.data);
      res.send(response.data);
    })
    .catch(err => res.send(err));
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));