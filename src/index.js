import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // You can create this file for global styles if needed
import App from './App'; // Assuming your main App component is defined here
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


reportWebVitals();
