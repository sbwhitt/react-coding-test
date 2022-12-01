import axios from 'axios';
import React, {useEffect} from 'react';
import './App.css';

function App() {

  useEffect(() => {
    axios.get('/api/supervisors').then((response) => console.log(response.data));
  }, []);

  return (
    <div className="main-content">
      <div className="form-container">
        <div>Title</div>
        <input type='text'></input>
        <button>Submit</button>
      </div>
    </div>
  );
}

export default App;
