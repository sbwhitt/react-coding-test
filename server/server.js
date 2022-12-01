const axios = require("axios");
const express = require("express");

const PORT = process.env.PORT || 5000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/api/supervisors", (req, res) => {
  axios.get("https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers")
    .then((response) => {
      const supervisors = [];
      // iterating supervisor list and building records if jurisdiction is not a number
      response.data.forEach((element) => {
        if (isNaN(parseInt(element.jurisdiction, 10))) {
          const s = element.jurisdiction + ' - ' + element.lastName + ', ' + element.lastName;
          supervisors.push({
            info: s,
            id: element.id
          }); 
        }
      });

      // sorting supervisors alphabetically then sending them to form
      supervisors.sort((a, b) => a.info.localeCompare(b.info));
      res.send(supervisors);
    })
    .catch(err => res.send(err));
});

server.put("/api/submit", (req, res) => {
  const formData = req.body.formData;
  // check if first or last name contains a number
  const isNumeric = /\d/.test(formData.firstName) || /\d/.test(formData.lastName);
  // verifying all required values are populated
  if (!isNumeric && formData.firstName && formData.lastName && formData.supervisor !== "none") {
    console.log(formData);
    res.status(200).send("success");
  }
  else res.status(400).send({ message: "Error: Malformed request" });
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));