import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

console.log('Przypinamy do ');
console.log(document.getElementById('app'));
ReactDOM.render(<App />, document.getElementById('app'));
