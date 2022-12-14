import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const [supervisors, setSupervisors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [supervisor, setSupervisor] = useState('none');

  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState({
    visible: false,
    errors: []
  });

  const [enableEmail, setEnableEmail] = useState(false);
  const [enablePhone, setEnablePhone] = useState(false);

  // populating supervisors from api on page load
  useEffect(() => {
    axios.get('/api/supervisors')
      .then((response) => {
        setSupervisors(response.data);
      });
  }, []);

  // submitting form data to api
  function submitForm() {
    // building api payload
    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: enableEmail ? email : null,
      phoneNumber: enablePhone ? phoneNumber : null,
      supervisor: supervisor
    }
    // sending form data to api
    axios.put('/api/submit', {formData: formData})
      .then((response) => {
        if (response.status === 200) {
          setFirstName('');
          setLastName('');
          setEmail('');
          setEnableEmail(false);
          setPhoneNumber('');
          setEnablePhone(false);
          setSupervisor('none');
          setSuccessMsg(true);
          setErrorMsg({visible: false, message: ''});
        }
      })
      .catch((err) => {
        console.log(err.response.data.errors);
        setSuccessMsg(false);
        setErrorMsg({visible: true, errors: err.response.data.errors});
      });
  }

  // rendering list of supervisors as select list options
  function renderOptions(options) {
    return options.map((item, index) =>
      <option value={item.info} name={item.info} key={item.id}>
        {item.info}
      </option>
    );
  }

  // rendering list of errors
  function renderErrors(errors) {
    return errors.map((item, index) =>
      <div key={index} className='error-msg'>{item}</div>
    );
  }

  // toggling email and phone number field based on checckbox selection
  function toggleEmail() {
    setEmail('');
    setEnableEmail(!enableEmail);
  }

  function togglePhone() {
    setPhoneNumber('');
    setEnablePhone(!enablePhone);
  }

  return (
    <div className='main-content'>
    <div className='form-container'>
      <div className='title'>
        <h2>Notification Form</h2>
      </div>
      <div className='messages'>
        { successMsg && <p className='success-msg'>Your notification request has been successfully submitted!</p> }
        { errorMsg.visible && renderErrors(errorMsg.errors) }
      </div>
      <div className='input-row'>
        <div className='input-group'>
          <label>First Name</label>
          <input value={firstName} type='text' className='txt-input' onChange={(e) => setFirstName(e.target.value)}></input>
        </div>
        <div className='input-group'>
          <label>Last Name</label>
          <input value={lastName} type='text' className='txt-input' onChange={(e) => setLastName(e.target.value)}></input>
        </div>
      </div>
      <div>
        How would you like to be notified?
      </div>
      <div className='input-row'>
        <div className='input-group'>
          <div className='check-row'>
            <input checked={enableEmail} type='checkbox' className='check-input' onChange={toggleEmail}></input>
            <label>Email</label>
          </div>
          <input disabled={!enableEmail} value={email} type='text' className='txt-input' onChange={(e) => setEmail(e.target.value)}></input>
        </div>
        <div className='input-group'>
          <div className='check-row'>
            <input checked={enablePhone} type='checkbox' className='check-input' onChange={togglePhone}></input>
            <label>Phone Number</label>
          </div>
          <input disabled={!enablePhone} value={phoneNumber} type='text' className='txt-input' onChange={(e) => setPhoneNumber(e.target.value)}></input>
        </div>
      </div>
      <div className='input-row'>
        <div className='input-group'>
          <label>Supervisor</label>
          <select value={supervisor} className='select-input' onChange={(e) => setSupervisor(e.target.value)}>
            <option value='none' name='none'>Select...</option>
            {renderOptions(supervisors)}
          </select>
        </div>
      </div>
      <div className='input-row'>
        <button className='submit-btn' onClick={submitForm}>Submit</button>
      </div>
    </div>
    </div>
  );
}

export default App;
