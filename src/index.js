import App from './components/app';
import React from 'react';
import ReactDOM from 'react-dom';

const wrapper = document.getElementById('container');
wrapper ? ReactDOM.render(<App />, wrapper) : false;