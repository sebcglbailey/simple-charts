import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Chart, { Marker } from './Chart/';

import addEmptyData from './Chart/src/addEmptyData';

import styles from './App.css';

import data from '../data/test.json';

let testData = data.data[0].values.map((score) => {
  return score.score
})

let series = [
  {
    name: "Credit Score",
    default: true,
    data: data.data[0].values,
    filter: (value) => {
      return value.score
    },
    min: 0,
    max: 700,
    color: "#aae1ea"
  },
  {
    name: "Short Term Debt",
    data: data.data[1].values,
    filter: (value) => {
      return value.balance
    },
    color: "#f3ba8b"
  },
  {
    name: "Long Term Debt",
    data: data.data[2].values,
    filter: (value) => {
      return value.balance
    },
    color: "#f3cddd"
  }
]

series.forEach((series) => {
  addEmptyData(series, data.index)
})

let length = (data.index.maxYear - data.index.minYear) * 12 + (data.index.maxMonth - data.index.minMonth)

const App = () => {
	return(
    <div className={styles.container}>
		  <Chart
        data={testData}
        series={series}
        length={length}
        centered
        marker
        margin={100}
        xAxisMarkers
      />
    </div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById("app")
);