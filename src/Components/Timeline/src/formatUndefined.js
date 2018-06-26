const formatUndefined = (series) => {

  let lastUndefined = series.dataArray.lastIndexOf(undefined)

  if (lastUndefined && lastUndefined > 0 && series.dataArray[lastUndefined - 1] && series.dataArray[lastUndefined - 1] !== undefined) {
    let newDataArray = series.dataArray.slice(0, lastUndefined)
    series.dataArray = newDataArray
  }

  let dataStarted = false

  series.dataArray.forEach((dataPoint, dataIndex) => {
    if (dataStarted && dataPoint == undefined) {
      series.dataArray[dataIndex] = 0
    } else if (dataPoint || dataPoint == 0) {
      dataStarted = true
    }
  })

}

export default formatUndefined