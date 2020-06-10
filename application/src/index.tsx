import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import data from "./miserables";

ReactDOM.render(
  <React.StrictMode>
    <App width={window.screen.availWidth}
    height={window.screen.availHeight}
    graph={data} />
  </React.StrictMode>,
  document.getElementById('root')
);
