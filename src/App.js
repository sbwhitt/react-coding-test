import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const [supervisors, setSupervisors] = useState([]);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [supervisor, setSupervisor] = useState(null);

  useEffect(() => {
    axios.get('/api/supervisors')
      .then((response) => {
        setSupervisors(response.data);
      });
  }, []);

  function submitForm() {
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      supervisor: supervisor
    }
    axios.put('/api/submit', {formData: formData}).catch(err => console.log(err.response.data.message));
  }

  function renderOptions(options) {
    return options.map((item, index) =>
      <option value={item.info} name={item.info} key={item.id}>
        {item.info}
      </option>
    );
  }

  return (
    <div className='form-container'>
      <h2>Notification Form</h2>
      <div className='input-row'>
        <div className='input-group'>
          <label>First Name</label>
          <input type='text' onChange={(e) => setFirstName(e.target.value)}></input>
        </div>
        <div className='input-group'>
          <label>Last Name</label>
          <input type='text' onChange={(e) => setLastName(e.target.value)}></input>
        </div>
      </div>
      <div className='input-row'>
        <div className='input-group'>
          <label>Email</label>
          <input type='text' onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className='input-group'>
          <label>Phone Number</label>
          <input type='text' onChange={(e) => setPhoneNumber(e.target.value)}></input>
        </div>
      </div>
      <div className='input-row'>
        <div className='input-group'>
          <label>Supervisor</label>
          <select onChange={(e) => setSupervisor(e.target.value)}>
            <option value='none' name='none'>Select...</option>
            {renderOptions(supervisors)}
          </select>
        </div>
      </div>
      <div className='input-row'>
        <button onClick={submitForm}>Submit</button>
      </div>
    </div>
  );
}

export default App;
