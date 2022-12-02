const axios = require('axios');
const express = require('express');

const PORT = process.env.PORT || 5000;
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// supervisors endpoint
server.get('/api/supervisors', (req, res) => {
  axios.get('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers')
    .then((response) => {
      const supervisors = [];
      // iterating supervisor list and building records if jurisdiction is not a number
      response.data.forEach((element) => {
        if (isNaN(parseInt(element.jurisdiction, 10))) {
          const s = element.jurisdiction + ' - ' + element.lastName + ', ' + element.firstName;
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

// submit endpoint
server.put('/api/submit', (req, res) => {
  const formData = req.body.formData;
  let errors = [];
  // checking error conditions for form data and adding appropriate errors
  if (!formData.firstName || !formData.lastName) errors.push('Name fields cannot be left blank');
  if (/\d/.test(formData.firstName) || /\d/.test(formData.lastName)) errors.push('Name fields cannot contain numbers');
  if (formData.supervisor === 'none' || !formData.supervisor) errors.push('Supervisor field must have a value');
  if (formData.email !== null) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errors.push('Valid email address required (example@email.com)');
  }
  // verifying phone number
  if (formData.phoneNumber !== null) {
    // regex allows whitespace in phone number but removes it before passing it to console
    if (!/^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/.test(formData.phoneNumber)) errors.push('Valid 10 digit phone number without special characters required (111 222 3333))');
    else formData.phoneNumber = formData.phoneNumber.replace(/\s/g, '');
  }
  // verifying all required values are populated and valid
  if (errors.length === 0) {
    console.log(formData);
    res.status(200).send('success');
  }
  else {
    res.status(400).send({ errors: errors });
  }
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));