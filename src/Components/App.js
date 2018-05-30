import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Chart, { Marker } from './Chart/';

import styles from './App.css';

import data from '../data/test.json';

let testData = data.data[0].values.map((score) => {
  return score.score
})

let series = [
  {
    name: "Credit Score",
    data: data.data[0].values,
    filter: (value) => {
      return value.score
    }
  },
  {
    name: "Short Term Debt",
    data: data.data[1].values,
    filter: (value) => {
      return value.balance
    }
  },
  {
    name: "Long Term Debt",
    data: data.data[2].values,
    filter: (value) => {
      return value.balance
    }
  }
]

const App = () => {
	return(
    <div className={styles.container}>
		  <Chart
        data={testData}
        series={series}
        centered
        marker
        margin={100}
      />
    </div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById("app")
);