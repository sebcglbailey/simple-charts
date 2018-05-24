import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Chart, { Marker } from './Chart/';

import styles from './App.css';

const testData = [
  50,
  140,
  150,
  140,
  145,
  135,
  125,
  88,
  60,
  120,
  112,
  100,
  120,
  118,
  116,
  116,
  82,
  10,
  190,
  180
]

const App = () => {
	return(
    <div className={styles.container}>
		  <Chart
        data={testData}
        marker
      />
    </div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById("app")
);