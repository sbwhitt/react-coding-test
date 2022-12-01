import axios from 'axios';
import React, {useEffect, useState} from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState(null);
  useEffect(() => {
    axios.get('/api/supervisors').then((response) => console.log(response.data));
  }, []);

  function submitForm() {
    setFormData({test: 'test'});
    axios.put('/api/submit', {formData: formData});
  }

  return (
    <div className="main-content">
      <div className="form-container">
        <div>Title</div>
        <input type='text'></input>
        <button onClick={submitForm}>Submit</button>
      </div>
    </div>
  );
}

export default App;
